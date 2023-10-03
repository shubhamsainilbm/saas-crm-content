import permissionsModel from "../models/permissions.model.js";
import userModel from "../models/user.model.js";
import userPermissionasModel from "../models/userPermissions.model.js";
import nodeMailer from "nodemailer";
import jobsModel from "../models/jobs.model.js";
import jobAssigningModel from "../models/jobAssigning.model.js";
import bcrypt from "bcryptjs";
import commentsModel from "../models/comments.model.js";
export const getAllUsers = async (req, res) => {
  const { role, search } = req.query;

  let queryObject = {};
  let roleObject = {};
  try {
    queryObject = search
      ? {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (role && role !== "all") {
      roleObject.role = role;
    }

    let users = userModel
      .find(queryObject)
      .select("-password")
      .where("role")
      .ne("admin")
      .find(roleObject);
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    let skip = (page - 1) * limit;
    users = users.skip(skip).limit(limit);

    const myData = await users;
    // if (!myData) {
    //   return res.status(400).json({ message: "No users found!" });
    // }
    res.json(myData);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  const { id } = req.body;
  try {
    let user = await userModel.findOne({ _id: req.userId }).select("-password");

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getAllAuthorAndEvaluator = async (req, res) => {
  try {
    const author = await userModel
      .find({ role: ["author"] }, { name: 1, email: 1, role: 1 })
      .select("-password")
      .lean();
    const evaluator = await userModel
      .find({ role: ["evaluator"] }, { name: 1, email: 1, role: 1 })
      .select("-password")
      .lean();
    if (!author || !evaluator) {
      return res.status(400).json({ message: "No users found!" });
    }
    res.json({ author, evaluator });
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  const { name, email, mobile, role, password } = req.body;
  try {
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `This Email is allReady in database`,
      });
    }
    const findPermissionID = await permissionsModel.findOne({
      permissionRole: role,
    });

    // req.body.createJob = findPermissionID.permissionCreateJob;
    // req.body.updateJob = findPermissionID.permissionUpdateJob;

    // Mail Send
    var smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SSL,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };
    let transporter = nodeMailer.createTransport(smtpConfig);
    let mailOptions = {
      from: process.env.SMTP_EMAIL_FROM,
      to: email,
      subject: "SUBJECT",
      text: "EMAIL BODY",
      html: `
      <!DOCTYPE html>
<html>

<head>
    <title>Page Title</title>
</head>



<body style="font-family: 'Poppins', sans-serif !important;">

    <section style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="justify-content: center; width: 800px; margin: auto;">
            <div style="box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;">
                <div style="background-color: white; padding: 0.5rem;">
                    <img src="../../public/images/logo.png" alt="img" class="img-fluid" style="height: 39px;">
                </div>

                <div style="background-color: #d8e8f0; padding: 3rem; text-align: center;">
                    <img src={"../../public/images/mail.png"} alt="img" class="mb-4 img-fluid">


                    <h1 style="color: #000;
                        font-size: 30px;
                        font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">Welcome</h1>
                    <h2 style=" color: #28a6fa;
                        font-size: 22px; margin-bottom: 1.5rem;">
                        *${email}*
                    </h2>

                    <p style="color: #000;
                        font-weight: 500;
                        font-size: 15px;">
                        Thanks for signing up for our updates. We'll be sending an occasional email. with everything
                        new and good that you'll probably want to know about: new products, Lorem , Lorem.
                    </p>
                    <p style="border-bottom: 1px dashed #28a6fa;">
                        Your Password is: <span style="color: #000;
                            font-weight: 700;
                            font-size: 15px;">${password}</span>
                    </p>
                </div>
            </div>
        </div>
        </div>
    </section>
</body>

</html>
      `,
    };
    req.body.image = "";
    const user = await userModel.create(req.body);
    if (user || role === findPermissionID.permissionRole) {
      await userPermissionasModel.create({
        userId: user?._id,
        permissionId: findPermissionID?._id,
        permissionRole: findPermissionID.permissionRole,
        permissionType: findPermissionID.permissionType,
      });
      transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("The email was sent successfully");
        }
      });
      res.status(200).json({
        success: true,
        message: "User Created Successfully",
        user,
      });
    }
  } catch (error) {
    console.log(error.stack);
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const {
    id,
    name,
    email,
    mobile,
    role,
    password,
    facebook,
    twitter,
    linkedin,
    authorBio,
    address,
    bankAccountNumber,
    ifseCode,
    panNumber,
    activeUser,
    defaultPayOut,
  } = req.body;

  try {
    if (!id || !name || !email || !mobile || !role) {
      res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser && existingUser?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate email" });
    }

    // user.name = name;
    // user.facebook = facebook;
    // const update = await userModel.findOneAndUpdate({ _id: id }, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // const hashPWD = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.role = role;
    if (password) {
      user.password = password;
    }
    user.facebook = facebook;
    user.twitter = twitter;
    user.linkedin = linkedin;
    user.authorBio = authorBio;
    user.address = address;
    user.bankAccountNumber = bankAccountNumber;
    user.ifseCode = ifseCode;
    user.panNumber = panNumber;
    user.activeUser = activeUser;
    user.defaultPayOut = defaultPayOut;
    await user.save();

    res.json("update");
  } catch (error) {
    console.log(error);
  }
};

export const updateOwnUser = async (req, res) => {
  const {
    name,
    email,
    mobile,
    password,
    facebook,
    twitter,
    linkedin,
    authorBio,
    address,
    bankAccountNumber,
    ifseCode,
    panNumber,
  } = req.body;
  try {
    if (!name || !email || !mobile) {
      res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser && existingUser?._id.toString() !== req.userId) {
      return res.status(409).json({ message: "Duplicate email" });
    }
    // const hashPWD = await bcrypt.hash(password, 10);
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    if (password) {
      user.password = password;
    }
    user.facebook = facebook;
    user.twitter = twitter;
    user.linkedin = linkedin;
    user.authorBio = authorBio;
    user.address = address;
    user.bankAccountNumber = bankAccountNumber;
    user.ifseCode = ifseCode;
    user.panNumber = panNumber;
    if (req?.file?.filename) {
      user.image = `${process.env.BASE_URL}/uploads/users-images/${req?.file?.filename}`;
    }
    await user.save();

    res.json("update");

    // user.name = name;
    // req.image = `uploads/${req?.file?.filename}`;
    // await userModel.findOneAndUpdate({ _id: user._id }, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // res.json("update");
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    // Confirm data
    if (!id) {
      return res.status(400).json({ message: "User ID Required" });
    }

    // Does the user still have assigned notes?
    const job = await jobsModel.findOne({ createdBy: id }).lean().exec();
    if (job) {
      return res.status(400).json({ message: "User has assigned Job" });
    }

    // Does the user exist to delete?
    const user = await userModel.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await userPermissionasModel.findOneAndDelete({ userId: id });

    const result = await user.deleteOne();

    const reply = `User ${result.email} with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    console.log(error);
  }
};

export const forceDeleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    // Confirm data
    if (!id) {
      return res.status(400).json({ message: "User ID Required" });
    }

    // Does the user exist to delete?
    const user = await userModel.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Does the user still have assigned notes?
    // const job = await jobsModel.findOne({ createdBy: id }).lean().exec();

    await jobsModel.deleteMany({ createdBy: id }).lean().exec();
    await commentsModel.deleteMany({ userId: id }).lean().exec();
    await jobAssigningModel.deleteMany({ userId: id }).lean().exec();

    await userPermissionasModel.findOneAndDelete({ userId: id }).lean().exec();

    const result = await user.deleteOne();

    const reply = `User ${result.email} with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    console.log(error);
  }
};

// Get User for Chat

export const getChatUsers = async (req, res) => {
  const { key, id } = req.params;
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const job = await jobsModel.findOne({ _id: id });
    console.log("job.assignJob.author", job?.assignJob?.author);
    // const users = await userModel
    //   .find(keyword)
    //   .find({
    //     _id: { $ne: req.userId },
    //     role: { $ne: "admin" },
    //     role:
    //       req.role === "keyword-analyst" || req.role === "evaluator"
    //         ? { $eq: "author" }
    //         : req.role === "author"
    //         ? { $in: ["keyword-analyst", "evaluator"] }
    //         : "No User Found",
    //   })
    //   .where("activeUser")
    //   .equals(true)
    //   .findOne({ email: job?.assignJob?.author });
    const findUserId = await userModel.findOne({ _id: job?.createdBy });
    console.log(findUserId.email);
    const users = await userModel.findOne({
      email:
        req.role === "keyword-analyst" ||
        req.role === "admin" ||
        req.role === "evaluator"
          ? job?.assignJob?.author
          : req.role === "author" && key === "KA"
          ? findUserId.email
          : req.role === "author" && key === "EA"
          ? job?.assignJob?.evaluator?.evaluatedBy
          : "",
    });
    console.log("first", users);

    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const dashBoardStack = async (req, res) => {
  const findUsers = await userModel.countDocuments({
    $and: [{ activeUser: true }, { role: "author" }],
  });

  const totalJobs = await jobsModel.find().lean();
  const activeJobs = await jobsModel.countDocuments({
    status: { $ne: "complete" },
  });
  // console.log(authorAc.length);
  // console.log(findUsers.length);
  const arrayJob = [];
  totalJobs?.find((items, i) => {
    // console.log(items.createdBy == req.userId && items.length);
    if (items.createdBy == req?.userId) arrayJob.push(items);
  });
  // console.log(totalJobs);
  console.log("first", arrayJob.length);
  req.role === "admin"
    ? res.json({
        totalJobs: totalJobs.length,
        totalActiveJobs: activeJobs,
        totalAuthor: findUsers,
      })
    : res.json({
        totalJobs: totalJobs.length,
        totalActiveJobs: activeJobs,
        totalAuthor: findUsers,
      });
};

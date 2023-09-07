import fs from "fs";
import jobsModel from "../models/jobs.model.js";
import userModel from "../models/user.model.js";
import userPermissionasModel from "../models/userPermissions.model.js";
import fastcsv from "fast-csv";
import jobAssigningModel from "../models/jobAssigning.model.js";
import path from "path";
import commentsModel from "../models/comments.model.js";
const __dirname = path.resolve();

// Get Job
export const getAllJobs = async (req, res) => {
  try {
    let jobs = jobsModel.find().populate("createdBy", { name: 1 });
    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No jobs founds",
      });
    }
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    let skip = (page - 1) * limit;
    jobs = jobs.skip(skip).limit(limit);

    const myJobs = await jobs;
    res.json(myJobs);
  } catch (error) {
    console.log(error);
  }
};

// Create Job
export const createJob = async (req, res) => {
  const {
    keyword,
    blogTitle,
    products,
    alliedKeyword,
    questions,
    interlinkingBlogs,
    priority,
    comments,
  } = req.body;

  try {
    const getUserDetails = await userPermissionasModel.findOne({
      userId: req.userId,
    });
    const getUserInfo = await userModel
      .findOne({ _id: req.userId })
      .select("-password");
    console.log(getUserDetails);
    if (getUserDetails.permissionType.view.createJob === false) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorize" });
    }
    if (
      !keyword ||
      !blogTitle ||
      !products ||
      !alliedKeyword ||
      !questions ||
      !interlinkingBlogs ||
      !comments
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fileds are required" });
    }

    const blogTitleDuplicate = await jobsModel.findOne({
      blogTitle: blogTitle,
    });

    if (blogTitleDuplicate) {
      return res.status(400).json({ message: "Duplicate Blog Title" });
    }

    req.body.createdBy = req.userId;
    const job = await jobsModel.create(req.body);
    if (job) {
      await commentsModel.create({
        jobId: job._id,
        comment: comments,
        userId: req.userId,
      });
      await jobAssigningModel.create({
        jobId: job._id,
        userId: req.userId,
        allocatedTo: "",
        evaluatedBy: "",
        wordCount: "",
        scoreGivenByEvaluator: "",
        dateOfPublishing: "",
        amount: "",
        url: "",
        paidOn: "",
        blogDocument: [],
        grammarlyScreenshot: [],
        activeMember: "",
      });
    }
    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

// Create Job Using csv
export const csvCreateJob = async (req, res) => {
  // console.log("csvFile", req.files?.csvFile);
  // console.log("csvFile", req.body);
  try {
    const filePath = path.join(__dirname, "uploads/", "csvFile.csv");
    if (!filePath) {
      return res.json({ message: "This field is required" });
    }
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .validate(function (data) {
        // console.log("data", data);
        return data;
      })
      .on("data-invalid", function (data) {
        // console.log("datasss", data);
      })
      .on("data", function (data) {
        // console.log("sds", JSON.parse(data[4]));

        csvData.push({
          keyword: data[0],
          blogTitle: data[1],
          products: data[2],
          alliedKeyword: data[3],
          questions: data[4],
          interlinkingBlogs: data[5],
          priority: data[6],
          comments: data[7],
          createdBy: req.userId,
          // id: data[0],
          // name: data[1],
          // description: data[2],
          // createdAt: data[3],
          // userId: "dfdfdfdfe23eht72r34634rtefefwr2r",
        });
      })
      .on("end", async function () {
        // remove the first line: header
        csvData.shift();

        // await jobsModel.insertMany(csvData, (err, res) => {
        //   if (err) throw err;

        //   console.log(`Inserted: ${res.insertedCount} rows`);
        //   client.close();
        // });

        await jobsModel
          .insertMany(csvData)
          .then((res) => {
            console.log("Inserted", res.length, "Document");
            res.filter(async (items) => {
              await jobAssigningModel.create({
                jobId: items._id,
                userId: req.userId,
                allocatedTo: "",
                evaluatedBy: "",
                wordCount: "",
                scoreGivenByEvaluator: "",
                dateOfPublishing: "",
                amount: "",
                url: "",
                paidOn: "",
                blogDocument: "",
                grammarlyScreenshot: "",
                activeMember: "",
              });
            });

            // if (err) throw {"sasas":err};
            // console.log("Successfully saved defult items to DB");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    res.json("success");
    stream.pipe(csvStream);
  } catch (error) {
    console.log(error);
  }
};

// Update Job
export const updateJob = async (req, res) => {
  const { userId } = req;
  const {
    id,
    keyword,
    blogTitle,
    products,
    alliedKeyword,
    questions,
    interlinkingBlogs,
    priority,
    comments,
  } = req.body;

  try {
    if (!id) {
      return res.json({ message: "Job id is required" });
    }
    // const checkUserPermission = await userPermissionasModel.findOne({
    //   userId: userId,
    // });
    // const obj1 = checkUserPermission.permissionType.edit;
    // const obj2 = req.body;
    // const obj1keys = Object.keys(checkUserPermission.permissionType.edit);
    // const obj2keys = Object.keys(req.body);

    // if (fdfd === keysss) {
    //   Object.keys(keysss).find((key) => {
    //     console.log(keysss[key].isPermission);
    //   });
    // }
    // const areEqual = obj1keys.filter((key) => {
    //   if (obj1[key].isPermission === false) {
    //     return obj1[key];
    //   }
    // });
    // const intersection = obj2keys.filter((element) =>
    //   // console.log(element)
    //   areEqual.includes(element)
    // );
    // console.log("pp", obj1keys);
    // console.log("pp", intersection);
    // if (intersection.length >= 1) {
    //   return res.json("You are not authorize to update these fileds");
    // }
    // const areEqual = obj1keys.find((key, index) => {
    // console.log(key)
    // console.log(obj2keys)
    // const objValue1 = obj1[key];
    // const objValue2 = obj2[obj2keys[index]];
    // return objValue1 === objValue2;
    // });
    // console.log("are", areEqual);
    const update = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    const updateComments = await commentsModel.findOne({ jobId: id });

    updateComments.comment = comments;

    await updateComments.save();
    res.json(update);
  } catch (error) {
    console.log(error);
  }
};

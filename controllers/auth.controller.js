import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import nodeMailer from "nodemailer";
import userPermissionsModel from "../models/userPermissions.model.js";

// Login
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // User Check
    const isUserCheck = await userModel.findOne({ email }).lean();
    if (!isUserCheck || !isUserCheck.activeUser) {
      return res.status(401).json({
        success: false,
        message: "Invalide Details",
      });
    }
    //Password Compare
    await bcrypt.compare(password, isUserCheck.password).then((response) => {
      if (!response) {
        return res.status(401).json({
          success: false,
          message: "Invalide Details",
        });
      }
    });
    const isUserPermissoins = await userPermissionsModel
      .findOne({ userId: isUserCheck._id })
      .lean();
    // if (!isUserCheck || !isUserCheck.activeUser) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalide Details",
    //   });
    // }
    // Access Token

    const accessToken = JWT.sign(
      {
        userInfo: {
          userId: isUserCheck._id,
          userName: isUserCheck.name,
          userEmail: isUserCheck.email,
          userRole: isUserCheck.role,
          permissions: isUserPermissoins.permissionType,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    // Refersh Token
    const refershToken = JWT.sign(
      {
        userEmail: isUserCheck.email,
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    // Create Cookies
    res.cookie("jwt", refershToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: "None",
      expires: new Date(Date.now() + 900000),
    });

    // Success
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const refreshToken = cookie.jwt;

  JWT.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decode) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const isUserCheck = await userModel.findOne({ email: decode.userEmail });
    if (!isUserCheck)
      return res.status(401).json({
        message: "Unauthorized",
      });
    const isUserPermissoins = await userPermissionsModel
      .findOne({ userId: isUserCheck._id })
      .lean();
    const accessToken = JWT.sign(
      {
        userInfo: {
          userId: isUserCheck._id,
          userName: isUserCheck.name,
          userEmail: isUserCheck.email,
          userRole: isUserCheck.role,
          permissions: isUserPermissoins.permissionType,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      accessToken,
    });
  });
};

// Logout
export const logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ message: "Logout Successfully" });
};

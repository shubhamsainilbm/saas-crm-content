import mongoose from "mongoose";
import jobAssigningModel from "../models/jobAssigning.model.js";
import jobsModel from "../models/jobs.model.js";
import notificationsModel from "../models/notifications.model.js";
import userModel from "../models/user.model.js";
import { formatDate } from "../functions/dateFunction.js";

export const getAllJobsAssign = async (req, res) => {
  try {
    const jobAssign = await jobAssigningModel.find();

    res.status(200).json({
      success: true,
      message: "Get Assign Jobs Successfully",
      jobAssign,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createJobAssigning = async (req, res) => {
  const {
    id,
    allocatedTo,
    evaluatedBy,
    wordCount,
    scoreGivenByEvaluator,
    dateOfPublishing,
    amount,
    url,
    paidOn,
    blogDocument,
    grammarlyScreenshot,
  } = req.body;
  try {
    // console.log(req?.files?.blogDocument[0].filename);
    if (!id || !allocatedTo || !evaluatedBy) {
      return res.status(400).json({
        success: false,
        message: "All Field's are required",
      });
    }

    const userDefaultPayOut = await userModel.findOne({ email: allocatedTo });
    console.log("first", userDefaultPayOut.defaultPayOut);

    let jobAssignings = await jobAssigningModel.findOne({ jobId: id });

    jobAssignings.allocatedTo = allocatedTo;
    jobAssignings.evaluatedBy = evaluatedBy;
    jobAssignings.wordCount = wordCount;
    jobAssignings.scoreGivenByEvaluator = userDefaultPayOut.defaultPayOut;
    jobAssignings.dateOfPublishing = dateOfPublishing;
    jobAssignings.amount = amount;
    jobAssignings.url = url;
    jobAssignings.paidOn = paidOn;

    if (req?.files.grammarlyScreenshot) {
      jobAssignings = await jobAssigningModel.findByIdAndUpdate(
        jobAssignings._id,
        {
          $push: {
            grammarlyScreenshot: `${process.env.BASE_URL}/uploads/grammarlyScreenshots/${req?.files?.grammarlyScreenshot[0]?.filename}`,
          },
        }
      );
    }
    if (req?.files.blogDocument) {
      jobAssignings = await jobAssigningModel.findByIdAndUpdate(
        jobAssignings._id,
        {
          $push: {
            blogDocument: `${process.env.BASE_URL}/uploads/blogDocument/${req?.files?.blogDocument[0]?.filename}`,
          },
        }
      );
    }
    // console.log(grammarlyScreenshot);
    if (grammarlyScreenshot) {
      jobAssignings.grammarlyScreenshot = grammarlyScreenshot;
    }
    if (blogDocument) {
      jobAssignings.blogDocument = blogDocument;
    }
    await jobAssignings.save();

    const job = await jobsModel.findOne({ _id: id });
    job.assignJob.author = allocatedTo;
    job.assignJob.evaluator = evaluatedBy;
    job.assignJobId = jobAssignings._id;
    await job.save();

    await notificationsModel.create({
      jobId: id,
      notifyTo: {
        author: {
          email: allocatedTo,
        },
        evaluator: {
          email: evaluatedBy,
        },
      },
    });

    res.json("Assigning");
  } catch (error) {
    console.log(error);
  }
};

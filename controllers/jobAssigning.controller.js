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
    if (!id || !allocatedTo || !evaluatedBy) {
      return res.status(400).json({
        success: false,
        message: "All Field's are required",
      });
    }

    const userDefaultPayOut = await userModel.findOne({ email: allocatedTo });

    let jobAssignings = await jobAssigningModel.findOne({ jobId: id });

    // console.log(grammarlyScreenshot);
    userDefaultPayOut.defaultPayOut = scoreGivenByEvaluator;
    await userDefaultPayOut.save();
    jobAssignings.allocatedTo = allocatedTo;
    jobAssignings.evaluatedBy = evaluatedBy;
    jobAssignings.wordCount = wordCount;
    jobAssignings.scoreGivenByEvaluator = scoreGivenByEvaluator
      ? scoreGivenByEvaluator
      : userDefaultPayOut.defaultPayOut;
    jobAssignings.dateOfPublishing = dateOfPublishing;
    jobAssignings.amount = Math.round(
      Number(jobAssignings.scoreGivenByEvaluator * jobAssignings.wordCount)
    );
    jobAssignings.url = url;
    jobAssignings.paidOn = paidOn;
    if (grammarlyScreenshot) {
      jobAssignings.grammarlyScreenshot = grammarlyScreenshot;
    }

    if (blogDocument) {
      jobAssignings.blogDocument = blogDocument;
    }

    if (req?.files.grammarlyScreenshot) {
      jobAssignings = await jobAssigningModel.findByIdAndUpdate(
        jobAssignings._id,
        {
          $push: {
            grammarlyScreenshot: `${process.env.BASE_URL}/uploads/grammarlyScreenshots/${req?.files?.grammarlyScreenshot[0]?.filename}`,
          },
        }
      );
      jobAssignings.allocatedTo = allocatedTo;
      jobAssignings.evaluatedBy = evaluatedBy;
      jobAssignings.wordCount = wordCount;
      jobAssignings.scoreGivenByEvaluator = scoreGivenByEvaluator
        ? scoreGivenByEvaluator
        : userDefaultPayOut.defaultPayOut;
      jobAssignings.dateOfPublishing = dateOfPublishing;
      jobAssignings.amount = Number(
        jobAssignings.scoreGivenByEvaluator * jobAssignings.wordCount
      );
      jobAssignings.url = url;
      jobAssignings.paidOn = paidOn;
      if (grammarlyScreenshot) {
        jobAssignings.grammarlyScreenshot = grammarlyScreenshot;
      }

      if (blogDocument) {
        jobAssignings.blogDocument = blogDocument;
      }
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
      jobAssignings.allocatedTo = allocatedTo;
      jobAssignings.evaluatedBy = evaluatedBy;
      jobAssignings.wordCount = wordCount;
      // jobAssignings.scoreGivenByEvaluator = scoreGivenByEvaluator
      //   ? scoreGivenByEvaluator
      //   : userDefaultPayOut.defaultPayOut;
      jobAssignings.scoreGivenByEvaluator = scoreGivenByEvaluator;
      jobAssignings.dateOfPublishing = dateOfPublishing;
      jobAssignings.amount = Number(
        jobAssignings.scoreGivenByEvaluator * jobAssignings.wordCount
      );
      jobAssignings.url = url;
      jobAssignings.paidOn = paidOn;
      if (grammarlyScreenshot) {
        jobAssignings.grammarlyScreenshot = grammarlyScreenshot;
      }

      if (blogDocument) {
        jobAssignings.blogDocument = blogDocument;
      }
    }
    console.log({ jobAssignings });
    await jobAssignings.save();
    const findEvalu = await jobAssigningModel.findOne({
      jobId: id,
    });
    console.log(findEvalu.grammarlyScreenshot.length);
    const job = await jobsModel.findOne({ _id: id });
    job.assignJob.author = allocatedTo;

    job.assignJob.evaluator = {
      evaluatedBy,
      gScreenShoot: findEvalu.grammarlyScreenshot.length === 0 ? false : true,
      blogDoc: findEvalu.blogDocument.length === 0 ? false : true,
    };
    // console.log("first", jobAssignings.grammarlyScreenshot.length);
    job.dateOfPublishing = jobAssignings.dateOfPublishing;
    console.log(
      "jobAssignings.jobAssignings.allocatedTo !==",
      jobAssignings.grammarlyScreenshot.length > 0
    );
    // if (jobAssignings.allocatedTo !== "") {
    //   jobAssignings.allocatedTo !== "" &&
    //   jobAssignings.grammarlyScreenshot !== "" &&
    //   jobAssignings.blogDocument.length !== ""
    //     ? (job.pendingOnDesk = "author")
    //     : (job.pendingOnDesk = "evaluator");
    //   // job.pendingOnDesk = "author";
    // }
    // console.log(jobAssignings.grammarlyScreenshot !== "");
    // job.pendingOnDesk =
    //   jobAssignings.allocatedTo !== "" ? "author" : "evaluator";
    // jobAssignings.allocatedTo !== "" && (job.pendingOnDesk = "author");
    const authorEmail = await userModel.findOne({ email: allocatedTo });
    const evaluatedByEmail = await userModel.findOne({ email: evaluatedBy });
    console.log(jobAssignings.grammarlyScreenshot !== "");
    job.pendingOnDesk === "job-allocator" && jobAssignings.allocatedTo !== ""
      ? (job.pendingOnDesk = `author - ${authorEmail.name}`)
      : job.pendingOnDesk === `author - ${authorEmail.name}` &&
        job?.assignJob?.evaluator?.evaluatedBy !== false &&
        job?.assignJob?.evaluator?.blogDoc !== false
      ? (job.pendingOnDesk = `evaluator - ${evaluatedByEmail.name}`)
      : job.pendingOnDesk === `evaluator - ${evaluatedByEmail.name}` &&
        jobAssignings.scoreGivenByEvaluator !== ""
      ? (job.pendingOnDesk = "analyst")
      : "";
    job.pendingOnDesk === "author" && jobAssignings.allocatedTo !== ""
      ? (job.status = "started")
      : job.pendingOnDesk === "evaluator" &&
        job?.assignJob?.evaluator?.evaluatedBy !== false &&
        job?.assignJob?.evaluator?.blogDoc !== false
      ? (job.status = "in-progress")
      : job.pendingOnDesk === "analyst" && jobAssignings.dateOfPublishing !== ""
      ? (job.status = "complete")
      : "";
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

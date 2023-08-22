import mongoose from "mongoose";
import jobAssigningModel from "../models/jobAssigning.model.js";
import jobsModel from "../models/jobs.model.js";
import notificationsModel from "../models/notifications.model.js";

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
  const { id, allocatedTo, evaluatedBy } = req.body;
  try {
    if (!id || !allocatedTo || !evaluatedBy) {
      return res.status(400).json({
        success: false,
        message: "All Field's are required",
      });
    }

    const jobAssignings = await jobAssigningModel.findOne({ jobId: id });

    jobAssignings.allocatedTo = allocatedTo;
    jobAssignings.evaluatedBy = evaluatedBy;
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

    console.log(jobAssignings);
    console.log(job);
    res.json("Assigning");
  } catch (error) {
    console.log(error);
  }
};

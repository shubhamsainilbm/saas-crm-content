import mongoose from "mongoose";

const JobAssigningSchema = new mongoose.Schema(
  {
    allocatedTo: {
      type: String,
      require: true,
    },
    evaluatedBy: {
      type: String,
      require: true,
    },
    wordCount: {
      type: String,
    },
    scoreGivenByEvaluator: {
      type: String,
    },
    dateOfPublishing: {
      type: String,
    },
    amount: {
      type: String,
    },
    url: {
      type: String,
    },
    paidOn: {
      type: String,
    },
    blogDocument: {
      type: String,
    },
    grammarlyScreenshot: {
      type: String,
    },
    activeMember: {
      type: String,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JobAssigning", JobAssigningSchema);

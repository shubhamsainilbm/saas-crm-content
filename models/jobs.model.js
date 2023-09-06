import mongoose, { mongo } from "mongoose";
import { stateList } from "../config/stateList.js";
const JobsSchema = mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    blogTitle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    products: {
      type: String,
      required: true,
      trim: true,
    },
    alliedKeyword: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [
      {
        type: Object,
        required: true,
        trim: true,
      },
    ],
    interlinkingBlogs: [
      {
        type: Object,
        required: true,
        trim: true,
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    comments: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "not-started",
        "testing",
        "on-hold",
        "awaiting-feedback,",
        "complete",
        "in-progress",
      ],
      default: "not-started",
    },
    assignJob: {
      author: {
        type: String,
        default: "",
        trim: true,
      },
      evaluator: {
        type: Object,
        default: "",
        trim: true,
      },
    },
    pendingOnDesk: {
      type: String,
      default: "job-allocator",
    },
    dateOfPublishing: {
      type: String,
      trim: true,
    },
    assignJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobAssigning",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobsSchema);

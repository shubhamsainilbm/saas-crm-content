import mongoose, { mongo } from "mongoose";
import { stateList } from "../config/stateList.js";
const JobsSchema = mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
    blogTitle: {
      type: String,
      required: true,
      unique: true,
    },
    products: {
      type: String,
      required: true,
    },
    alliedKeyword: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: Object,
        required: true,
      },
    ],
    interlinkingBlogs: [
      {
        type: Object,
        required: true,
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
      },
      evaluator: {
        type: String,
        default: "",
      },
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

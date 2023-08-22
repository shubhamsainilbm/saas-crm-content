import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    notifyTo: {
      author: {
        email: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
      evaluator: {
        email: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", NotificationsSchema);

import mongoose, { mongo } from "mongoose";

const ChatsSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatsSchema);

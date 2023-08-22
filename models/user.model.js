import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "sub-admin",
        "keyword-analyst",
        "job-allocator",
        "author",
        "evaluator",
        "analyst",
      ],
      default: "author",
      required: true,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    authorBio: {
      type: String,
    },
    address: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
    },
    ifseCode: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    defaultPayOut: {
      type: String,
    },
    activeUser: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", UserSchema);

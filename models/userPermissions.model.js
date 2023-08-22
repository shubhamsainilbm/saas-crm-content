import mongoose from "mongoose";

const UserPermissionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permissions",
  },
  permissionRole: {
    type: String,
    require: true,
  },
  permissionType: {
    type: Object,
  },
});

export default mongoose.model("UserPermissions", UserPermissionsSchema);

import mongoose from "mongoose";

const RolesSchema = new mongoose.Schema({
     roles: {
          type: String,
          required: true,
          enum: ["admin", "keyword-analyst", "job-allocator", "author", "evaluator", "analyst"],
          default: "author"
     },
     permissionType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permissions",
          required: true

     }
})

export default mongoose.model("Roles", RolesSchema)

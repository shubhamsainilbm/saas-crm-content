import permissionsModel from "../models/permissions.model.js";
import userModel from "../models/user.model.js";

// Create Permissions
export const createPermissions = async (req, res) => {
  const { permissionRole } = req.body;

  try {
    if (!permissionRole) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Permission Type",
      });
    }

    // Role Check
    const findPermission = await permissionsModel
      .findOne({ permissionRole })
      .lean();
    if (findPermission) {
      return res.status(400).json({
        success: false,
        message: "This Permission role is already in database",
      });
    }

    // // Limit Check
    // const findPermissionLength = await permissionsModel.find().lean();
    // const fg = findPermissionLength.length === 5;
    // if (fg === false) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Permission Create Limit reach",
    //   });
    // }

    // Create Permission
    const permission = await permissionsModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Permission Create Successfully",
      permission,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update Permissions
export const updatePermissions = async (req, res) => {
  const id = "64b7d3e746f36a0e24e51373";
  const { createJob } = req.body;
  const getData = await permissionsModel.findById({ _id: id });
  await userModel.findOneAndUpdate(
    {
      _id: "64b7df6c1b0a6dbbecc29249",
    },

    { permissionType: req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "updatePermissions  successfully",
    updatePermissions,
  });
};

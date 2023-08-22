import userPermissionsModel from "../models/userPermissions.model.js";

export const getUserPermissions = async (req, res) => {
  try {
    const permissions = await userPermissionsModel.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.log(error);
  }
};

export const updateUserPermissions = async (req, res) => {
  // const userId = "64c103c819fb99e4659b4a85";
  const { id, permissionType } = req.body;

  try {
    const checkUser = await userPermissionsModel.findOne({ userId: id });

    checkUser.permissionType = permissionType;

    checkUser.save();

    res
      .status(200)
      .json({ status: true, message: "Permission's Update SuccessFully" });
  } catch (error) {
    console.log(error);
  }

  // Object.keys(checkUser.permissionType.view).filter((item) => {
  //   console.log("item", item);
  //   // if(typeof myObject[item] == "number" && myObject[item] >= 4) {
  //   //     myObject[item] = 10
  //   // }
  // });

  // const uPermissionUpdate = await userPermissionsModel.updateMany({
  //   permissionType: req.body,
  // });

  // console.log(uPermissionUpdate);
};

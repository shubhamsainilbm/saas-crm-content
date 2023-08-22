import { rolesList } from "../config/rolesList.js";
import userModel from "../models/user.model.js";

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role)
      return res
        .status(401)
        .json({ message: "you are not login right portal" });
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);

    const result = rolesArray.includes(req?.role);
    if (!result)
      return res
        .status(401)
        .json({ message: "you are not login right portal" });
    next();
  };
};

export default verifyRoles;

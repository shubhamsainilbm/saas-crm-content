import { Router } from "express";
import {
  createUser,
  deleteUser,
  forceDeleteUser,
  getAllAuthorAndEvaluator,
  getAllUsers,
  getChatUsers,
  getUser,
  updateOwnUser,
  updateUser,
} from "../controllers/user.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import { rolesList } from "../config/rolesList.js";
import verifyRoles from "../middleware/verifyRoles.middleware.js";
import uploadImg from "../middleware/uploadImg.js";
const router = Router();

router.use(verifyJWT);

router.post(
  "/create-user",
  verifyRoles(rolesList.admin, rolesList.subAdmin),
  createUser
);
router.patch(
  "/update-user",
  verifyRoles(rolesList.admin, rolesList.subAdmin),
  updateUser
);
router.patch("/update-own-user", uploadImg.single("userImg"), updateOwnUser);
router.get(
  "/get-users",
  verifyRoles(rolesList.admin, rolesList.subAdmin),
  getAllUsers
);
router.get("/get-user", getUser);
router.get("/get-author-and-evaluator", getAllAuthorAndEvaluator);
router.delete("/delete-user", deleteUser);
router.delete("/force-delete-user", forceDeleteUser);
router.get("/get-chat-users", getChatUsers);

export default router;

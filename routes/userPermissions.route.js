import { Router } from "express";
import {
  getUserPermissions,
  updateUserPermissions,
} from "../controllers/userPermissions.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";

const router = Router();

router.use(verifyJWT);

router.patch("/update-user-permissions", updateUserPermissions);
router.get("/get-user-permissions", getUserPermissions);

export default router;

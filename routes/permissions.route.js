import Router from "express";
import {
  createPermissions,
  updatePermissions,
} from "../controllers/permissions.controller.js";

const router = Router();

router.post("/create-permissions", createPermissions);
router.patch("/update-permissions", updatePermissions);

export default router;

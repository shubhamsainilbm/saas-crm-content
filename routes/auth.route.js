import { Router } from "express";
import {
  loginController,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", loginController);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

export default router;

import { Router } from "express";

import verifyJWT from "../middleware/verifyJWT.middleware.js";
import { getNotifications } from "../controllers/notifications.controller.js";

const router = Router();
router.use(verifyJWT);
router.get("/get-notifications", getNotifications);

export default router;

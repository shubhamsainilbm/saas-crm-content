import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import { allMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();
router.use(verifyJWT);
router.post("/send-message", sendMessage);
router.get("/get-all-messages/:chatId", allMessages);

export default router;

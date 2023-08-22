import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import { createChats, getChats } from "../controllers/chats.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/create-chat", createChats);
router.get("/get-chats", getChats);

export default router;

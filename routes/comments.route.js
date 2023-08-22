import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import { addComment, getComments } from "../controllers/comments.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/add-comment", addComment);
router.get("/get-comments", getComments);

export default router;

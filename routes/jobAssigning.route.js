import { Router } from "express";
import {
  createJobAssigning,
  getAllJobsAssign,
} from "../controllers/jobAssigning.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import uploadGrammarlyScreenshoot from "../middleware/uploadGrammarlyScreenshoot.js";
import uploadBlogDocument from "../middleware/uploadBlogDocument.js";

const router = Router();
router.use(verifyJWT);
router.put(
  "/create-job-assigning",
  uploadGrammarlyScreenshoot.fields([
    {
      name: "grammarlyScreenshot",
      // maxCount: 1,
    },
    {
      name: "blogDocument",
      // maxCount: 1,
    },
  ]),
  // uploadGrammarlyScreenshoot.mul("grammarlyScreenshot"),
  // uploadBlogDocument.single("blogDocument"),
  createJobAssigning
);
router.get("/get-job-assigning", getAllJobsAssign);

export default router;

import { Router } from "express";
import {
  createJobAssigning,
  getAllJobsAssign,
} from "../controllers/jobAssigning.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";

const router = Router();
router.use(verifyJWT);
router.put("/create-job-assigning", createJobAssigning);
router.get("/get-job-assigning", getAllJobsAssign);

export default router;

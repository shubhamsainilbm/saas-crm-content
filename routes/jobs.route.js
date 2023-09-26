import { Router } from "express";
import {
  createJob,
  csvCreateJob,
  getAllJobs,
  getJobByStatus,
  jobStatus,
  updateJob,
} from "../controllers/jobs.controller.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";
import uploadCsvFile from "../middleware/uploadCsvFile.js";

const router = Router();

router.use(verifyJWT);
router.post("/create-job", createJob);
router.post("/csv-create-job", uploadCsvFile.single("csvFile"), csvCreateJob);
router.patch("/update-jobs", updateJob);
router.get("/get-jobs", getAllJobs);
router.get("/get-job-status", jobStatus);
router.get("/get-job-by-status", getJobByStatus);

export default router;

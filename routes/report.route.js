import { Router } from "express";
import {
    getAllAuthorReport,
    getAllJobsReport,
    authorJobSubmissionReport,
    getPublishedJobReport,
    getJobStagnationReport,
    demo
} from "../controllers/report.controler.js";
import verifyJWT from "../middleware/verifyJWT.middleware.js";


const router = Router();
router.use(verifyJWT);
router.get("/get-all-author-report", getAllAuthorReport);
router.get("/get-all-jobs-report", getAllJobsReport);
router.get("/get-all-author-job-submission-report", authorJobSubmissionReport);
router.get("/get-published-job-report", getPublishedJobReport);
router.get("/get-job-stagnation-report", getJobStagnationReport);

router.get("/demo", demo);


export default router;

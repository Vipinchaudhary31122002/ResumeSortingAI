import { Router } from "express";
import { userVerification } from "../middlewares/AuthMiddleware.js";
import { GetAllResumes } from "../controllers/ResumeController.js"

const router = Router();

// GET all resumes for a specific batch
router.get("/getallresume/:batchId", userVerification, GetAllResumes);

export default router;

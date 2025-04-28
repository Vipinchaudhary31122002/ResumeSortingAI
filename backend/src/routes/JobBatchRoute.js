import { Router } from "express";
import { upload } from '../middlewares/multerZip.js';
import { CreateJobBatch, ProcessBatch, GetJobBatch } from "../controllers/JobBatchController.js";
import { userVerification } from "../middlewares/AuthMiddleware.js";

const router = Router();
router.route("/uploadjobbatch").post(userVerification, upload.single('zip'), CreateJobBatch, ProcessBatch);
router.route("/getjobbatches").get(userVerification, GetJobBatch);


export default router;

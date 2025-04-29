import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import unzipper from "unzipper";
import mime from "mime-types";
import { supabase } from "../utils/supabaseClient.js";
import { db } from "../db/connectdb.js";
import { job_batches } from "../db/schemas/job_batches.js";
import { resumes } from "../db/schemas/resumes.js";
import { eq } from "drizzle-orm";
import axios from "axios";

// Check for duplicate job titles
export async function checkDuplicateJobTitle(job_title) {
  const existing = await db
    .select()
    .from(job_batches)
    .where(eq(job_batches.job_title, job_title));
  return existing.length > 0;
}

// Create a new job batch entry
export async function createJobBatchEntry(job_title, job_description, userId) {
  const batchId = uuidv4();
  await db.insert(job_batches).values({
    id: batchId,
    job_title,
    job_description,
    user_id: userId,
  });
  return batchId;
}

// Extract ZIP file to a temporary directory
export function extractZipToTemp(zipBuffer, batchId) {
  const extractPath = path.join(os.tmpdir(), batchId);
  fs.mkdirSync(extractPath, { recursive: true });

  const zipPath = path.join(extractPath, "resumes.zip");
  fs.writeFileSync(zipPath, zipBuffer);

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", () => {
        fs.unlinkSync(zipPath);
        resolve(extractPath);
      })
      .on("error", reject);
  });
}

// Upload file to Supabase and insert record into DB
export async function uploadFileToSupabase(filePath, batchId, userId) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || "application/octet-stream";
  const resumeId = uuidv4();
  const extension = path.extname(filePath) || ".pdf";
  const storageFilePath = `${batchId}/${resumeId}${extension}`;

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storageFilePath, fileContent, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error(`❌ Error uploading file:`, uploadError);
    throw new Error("Error uploading resume");
  }

  // Get public URL
  const { data: urlData, error: urlError } = supabase.storage
    .from("resumes")
    .getPublicUrl(storageFilePath);

  if (urlError) {
    console.error(`❌ Error getting public URL:`, urlError);
    throw new Error("Error getting resume URL");
  }

  const publicUrl = urlData.publicUrl;

  // Insert resume record into DB
  await db.insert(resumes).values({
    id: resumeId,
    batch_id: batchId,
    file_name: `${resumeId}${extension}`,
    resume_url: publicUrl,
    uploaded_by: userId,
  });

  return {
    resumeId,
    fileName: `${resumeId}${extension}`,
    publicUrl,
  };
}

export const CreateJobBatch = async (req, res, next) => {
  try {
    const { job_title, job_description } = req.body;
    const zipFile = req.file;

    if (!zipFile || !zipFile.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Zip file is required" });
    }

    const isDuplicate = await checkDuplicateJobTitle(job_title);
    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: "Job title already exists, please choose a different one.",
      });
    }

    const batchId = await createJobBatchEntry(
      job_title,
      job_description,
      req.userdata.userId
    );
    const extractPath = await extractZipToTemp(zipFile.buffer, batchId);

    const files = fs.readdirSync(extractPath);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(extractPath, file);
        await uploadFileToSupabase(filePath, batchId, req.userdata.userId);
      })
    );

    // Pass batchId and extractPath to the next middleware
    req.batchId = batchId;
    req.job_description = job_description;
    next();
  } catch (error) {
    console.error("❌ Error in CreateJobBatch:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating job batch",
      error: error.message,
    });
  }
};

// Process Job Batch
export const ProcessBatch = async (req, res) => {
  try {
    const { batchId, job_description } = req;

    const allResumes = await db
      .select({ resumeId: resumes.id, resumeUrl: resumes.resume_url })
      .from(resumes)
      .where(eq(resumes.batch_id, batchId));

    for (const { resumeId, resumeUrl } of allResumes) {
      const payload = {
        job_description: job_description,
        resume_url: resumeUrl,
      };

      const { data: parsedData } = await axios.post(
        "http://localhost:8000/generate-report",
        payload
      );

      const {
        name,
        email,
        phone,
        skills,
        experience,
        education,
        certification,
        jd_score,
        ats_score,
        keyword_match,
      } = parsedData.report;

      await db
        .update(resumes)
        .set({
          name: name || "",
          email: email || "",
          phone: phone || "",
          skills: skills || "",
          experience: experience || "",
          education: education || "",
          certification: certification || "",
          jd_score: jd_score || 0,
          ats_score: ats_score || 0,
          keyword_match: keyword_match || 0,
          resume_url: resumeUrl,
        })
        .where(eq(resumes.id, resumeId));

      console.log(`✅ Resume ${resumeId} processed successfully`);
    }

    return res.status(200).json({
      success: true,
      message: "Batch processed and resumes parsed successfully",
      batchId,
      resumeCount: allResumes.length,
    });
  } catch (error) {
    console.error("❌ Error in ProcessBatch:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing batch",
      error: error.message,
    });
  }
};

export const GetJobBatch = async (req, res) => {
  try {
    const userId = req.userdata.userId;

    const jobBatches = await db
      .select({
        id: job_batches.id,
        created_at: job_batches.created_at,
        job_title: job_batches.job_title,
        csv_url: job_batches.csv_url,
      })
      .from(job_batches)
      .where(eq(job_batches.user_id, userId));

    if (jobBatches.length === 0) {
      return res
        .status(200)
        .json({ message: "No job batches found for this user." });
    }

    res.status(200).json({ jobBatches });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching job batches." });
  }
};

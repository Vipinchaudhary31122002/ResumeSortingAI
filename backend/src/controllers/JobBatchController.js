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
    req.extractPath = extractPath;
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
    const { batchId, extractPath } = req;
    if (!batchId || !extractPath) {
      return res.status(400).json({
        success: false,
        message: "Batch ID and extract path are required",
      });
    }

    const pdfFiles = fs
      .readdirSync(extractPath)
      .filter((file) => file.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PDF files found in the extracted path",
      });
    }

    // Process each resume one by one
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(extractPath, pdfFile);

      // Upload to Supabase and get details
      const { resumeId, publicUrl } = await uploadFileToSupabase(
        pdfPath,
        batchId,
        req.userdata.userId
      );

      // Prepare payload for Python server
      const resumeData = {
        id: resumeId,
        url: publicUrl,
      };

      // Send resume to Python server for parsing
      const pythonServerUrl = "http://localhost:8000/parse-resume"; // Replace with your Python server URL
      const { data: parsedData } = await axios.post(
        pythonServerUrl,
        resumeData
      );

      const {
        name,
        email,
        phone,
        skills,
        experience,
        education,
        certification,
      } = parsedData;

      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      // Ensure skills is a valid JSON array
      if (skills !== undefined) {
        // Check if it's already an array, if not, parse it
        updateData.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
      }

      if (experience !== undefined) updateData.experience = experience;
      if (education !== undefined) updateData.education = education;
      if (certification !== undefined) updateData.certification = certification;

      // Update if there's anything to update
      if (Object.keys(updateData).length > 0) {
        await db
          .update(resumes)
          .set(updateData)
          .where(eq(resumes.id, resumeId));
      }

      // Update resume record with parsed data
      await db
        .update(resumes)
        .set({
          name,
          email,
          phone,
          skills: Array.isArray(skills) ? skills : JSON.parse(skills), // Ensure skills is an array
          experience,
          education,
          certification,
        })
        .where(eq(resumes.id, resumeId));

      console.log(`✅ Resume ${resumeId} processed successfully`);
    }

    // Clean up extracted files
    fs.rmSync(extractPath, { recursive: true, force: true });

    return res.status(200).json({
      success: true,
      message: "Batch processed and resumes parsed successfully",
      batchId,
      resumeCount: pdfFiles.length,
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
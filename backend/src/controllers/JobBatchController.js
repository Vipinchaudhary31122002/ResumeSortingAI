import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import unzipper from "unzipper";
import { db } from "../db/connectdb.js";
import { job_batches } from "../db/schemas/job_batches.js";
import { resumes } from "../db/schemas/resumes.js";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY } from "../constants.js";
import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import os from 'os';



// Supabase client
const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

export const CreateJobBatch = async (req, res) => {
  try {
    const { job_title, job_description } = req.body;
    const zipFile = req.file;

    if (!zipFile || !zipFile.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Zip file is required" });
    }

    // 1. Check for duplicate job_title
    const existingBatch = await db
      .select()
      .from(job_batches)
      .where(job_batches.job_title.eq(job_title));

    if (existingBatch.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Job title already exists, please choose a different one.",
      });
    }

    // 2. Create new batch
    const batchId = uuidv4();
    await db.insert(job_batches).values({
      id: batchId,
      job_title,
      job_description,
      user_id: uuidv4(), // replace with real user ID from auth
    });

    // 3. Extract zip
    const extractedFiles = [];
    const zip = await unzipper.Open.buffer(zipFile.buffer);
    for (const entry of zip.files) {
      if (entry.path.endsWith(".pdf") && !entry.path.endsWith("/")) {
        const buffer = await entry.buffer();
        extractedFiles.push({ name: path.basename(entry.path), buffer });
      }
    }

    if (extractedFiles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No PDF files found in zip" });
    }

    let resumeCount = 0;

    // 4. Process PDFs
    for (const file of extractedFiles) {
      const resumeId = uuidv4();
      const storagePath = `resumes/${resumeId}.pdf`;

      // Insert initial row
      await db.insert(resumes).values({
        id: resumeId,
        batch_id: batchId,
        name: file.name,
        resume_url: "",
      });

      // Upload to Supabase
      const { error } = await supabase.storage
        .from("resumes") // 🔁 Change this
        .upload(storagePath, file.buffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${file.name}:`, error.message);
        continue;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("resumes")
        .getPublicUrl(storagePath);

      const resumeUrl = data.publicUrl;

      // Update resume URL
      await db
        .update(resumes)
        .set({ resume_url: resumeUrl })
        .where(resumes.id.eq(resumeId));

      resumeCount++;
    }

    // 5. Update batch with resume count
    await db
      .update(job_batches)
      .set({ resume_count: resumeCount })
      .where(job_batches.id.eq(batchId));

    res.status(201).json({
      success: true,
      message: "Job batch created and resumes uploaded",
      batchId,
      uploaded: resumeCount,
    });
  } catch (err) {
    console.error("❌ Error in createJobBatch:", err);
    res.status(500).json({ success: false, message: "Server error occurred" });
  }
};


export const ProcessBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    // Step 1: Get all resumes of the batch
    const resumeList = await db.select().from(resumes).where(resumes.batch_id.eq(batchId));

    const resumeUrls = resumeList.map(r => r.resume_url);

    if (resumeUrls.length === 0) {
      return res.status(404).json({ message: 'No resumes found for the batch.' });
    }

    // Step 2: Send resume URLs to Python server
    const pythonRes = await axios.post('http://localhost:8000/process-resumes', {
      batchId,
      resumeUrls
    });

    const updatedResumes = pythonRes.data; // assuming list of resume scores and ids

    // Step 3: Update resumes with scores
    for (const resume of updatedResumes) {
      await db.update(resumes)
        .set({
          jd_score: resume.jd_score,
          ats_score: resume.ats_score,
          ai_score: resume.ai_score,
          length_score: resume.length_score,
          keyword_match: resume.keyword_match
        })
        .where(resumes.id.eq(resume.id));
    }

    // Step 4: Create a CSV file of updated resumes
    const csvWriter = createObjectCsvWriter({
      path: path.join(os.tmpdir(), `${batchId}.csv`),
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'jd_score', title: 'JD Score' },
        { id: 'ats_score', title: 'ATS Score' },
        { id: 'ai_score', title: 'AI Score' },
        { id: 'length_score', title: 'Length Score' },
        { id: 'keyword_match', title: 'Keyword Match' },
        { id: 'resume_url', title: 'Resume URL' },
      ]
    });

    await csvWriter.writeRecords(updatedResumes);

    const filePath = path.join(os.tmpdir(), `${batchId}.csv`);
    const fileBuffer = fs.readFileSync(filePath);

    // Step 5: Upload CSV to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('csv')
      .upload(`${batchId}.csv`, fileBuffer, {
        contentType: 'text/csv',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('csv')
      .getPublicUrl(`${batchId}.csv`);

    const csvUrl = urlData.publicUrl;

    // Step 6: Update job_batches with csv_url
    await db.update(job_batches)
      .set({ csv_url: csvUrl })
      .where(job_batches.id.eq(batchId));

    res.status(200).json({ message: 'Batch processed and CSV uploaded.', csvUrl });
  } catch (err) {
    console.error('❌ Error in processBatch:', err);
    res.status(500).json({ message: 'Batch processing failed.', error: err.message });
  }
};

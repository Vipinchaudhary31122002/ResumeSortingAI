import { db } from "../db/connectdb.js";
import { resumes } from "../db/schemas/resumes.js";
import { eq, and } from "drizzle-orm";

export const GetAllResumes = async (req, res) => {
  try {
    const batchId = req.params.batchId; // Batch ID from URL params

    // Fetch resumes belonging to the batch and the user
    const allResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.batch_id, batchId));
    if (allResumes.length === 0) {
      return res
        .status(200)
        .json({ message: "No resumes found for this batch." });
    }

    res.status(200).json({ resumes: allResumes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching resumes." });
  }
};

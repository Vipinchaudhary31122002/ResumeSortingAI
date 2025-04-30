"use client";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Fetch all resumes of a specific batch
export const getAllResumesByBatch = async (batchId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/resume/getallresume/${batchId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching resumes for this batch"
    );
  }
};

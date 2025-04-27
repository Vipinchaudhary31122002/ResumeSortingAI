'use client';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function useJobBatch() {
  const uploadBatch = async (formData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/uploadjobbatch`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error uploading batch';
    }
  };

  const getBatchStatus = async (batchId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/batch/${batchId}/status`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error getting batch status';
    }
  };

  const getBatchResults = async (batchId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/batch/${batchId}/results`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error getting batch results';
    }
  };

  return {
    uploadBatch,
    getBatchStatus,
    getBatchResults
  };
}

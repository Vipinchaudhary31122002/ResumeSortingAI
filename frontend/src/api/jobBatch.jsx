'use client';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/jobbatch';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export function useJobBatch() {
  const uploadBatch = async (formData) => {
    try {
      const response = await axiosInstance.post('/uploadjobbatch', formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error uploading batch');
    }
  };

  const getUserBatches = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getjobbatches`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching job batches');
    }
  };

  const getBatchStatus = async (batchId) => {
    try {
      const response = await axiosInstance.get(`/jobbatch/batch/${batchId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting batch status');
    }
  };

  const getBatchResults = async (batchId) => {
    try {
      const response = await axiosInstance.get(`/jobbatch/batch/${batchId}/results`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting batch results');
    }
  };

  return {
    uploadBatch,
    getUserBatches,
    getBatchStatus,
    getBatchResults
  };
}

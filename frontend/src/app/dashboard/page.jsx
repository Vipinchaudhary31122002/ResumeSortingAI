"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useJobBatch } from "@/api/jobBatch";

export default function UploadPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [resumesZip, setResumesZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jobBatches, setJobBatches] = useState([]);
  const router = useRouter();
  const { uploadBatch, getUserBatches } = useJobBatch();
  const [loadingBatches, setLoadingBatches] = useState(true);

  // Fetch job batches on component mount
  useEffect(() => {
    fetchJobBatches();
  }, []);

  const fetchJobBatches = async () => {
    try {
      setLoadingBatches(true);
      const response = await getUserBatches();
      if (Array.isArray(response.jobBatches))
        setJobBatches(response.jobBatches);
      else {
        setJobBatches([]);
      }
    } catch (err) {
      console.error("Error fetching job batches:", err);
      setJobBatches([]); // safe fallback
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumesZip || !projectTitle || !projectDescription) {
      setError("Please fill in all fields and upload the required files");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("zip", resumesZip);
      formData.append("job_title", projectTitle);
      formData.append("job_description", projectDescription);

      const response = await uploadBatch(formData);

      // Show success message
      setSuccess(`Job "${projectTitle}" uploaded successfully!`);

      // Clear form after successful upload
      setProjectTitle("");
      setProjectDescription("");
      setResumesZip(null);

      // Reset file input
      e.target.reset();

      // Refresh job batches list
      fetchJobBatches();
    } catch (err) {
      setError(err.message || "Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      <div className="flex flex-col h-full p-4 overflow-hidden">
        <Navbar />

        <main className="flex flex-1 space-x-4">
          <div className="flex flex-col w-1/2 bg-white p-6 rounded-2xl shadow-lg space-y-8 mt-4">
            <h1 className="text-6xl font-extrabold text-center mb-8 w-full text-black">
              Job Upload
            </h1>
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-500">
                Upload your job details and zip files for analysis
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
              )}
              {success && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  {success}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Enter job title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Job Description
                </label>
                <textarea
                  placeholder="Enter job description"
                  rows={10}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black">
                  Resume ZIP file
                </label>
                <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setResumesZip(e.target.files[0])}
                    className="w-full text-black"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a ZIP file containing PDF resumes
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-white cursor-pointer ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Uploading and Processing..." : "Upload Job"}
              </button>
            </form>
          </div>

          <div className="flex flex-col w-1/2 bg-white p-6 rounded-2xl shadow-lg space-y-8 mt-4 overflow-y-auto">
            <h1 className="text-4xl font-bold text-black">
              Recent Job Uploads
            </h1>
            {loadingBatches ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading job batches...</p>
              </div>
            ) : jobBatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No job batches found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-black">
                      {batch.job_title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded on {formatDate(batch.created_at)}
                    </p>

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/batchanalysis?id=${batch.id}`)
                        }
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                      >
                        View Resumes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

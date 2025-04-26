"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [resumesZip, setResumesZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvResult, setCsvResult] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumesZip || !projectTitle || !projectDescription) {
      return alert("Please fill in all fields and upload the required files");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume_zip", resumesZip);
    formData.append("title", projectTitle);
    formData.append("description", projectDescription);

    try {
      const res = await axios.post(
        "http://localhost:8000/resumes/batch",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCsvResult(res.data.csv);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="flex w-screen h-screen overflow-hidden bg-black text-white p-8 space-x-8">
      {/* Job Upload Form Section */}
      <div className="flex flex-col w-1/2 bg-white p-6 rounded-2xl shadow-lg space-y-8 sticky top-16">
        <h1 className="text-6xl font-extrabold text-center mb-8 w-full text-black">Job Upload</h1>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-500">
            Upload your job details and zip files for analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-black">Project Title</label>
            <input
              type="text"
              placeholder="Enter project title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
            />
          </div>

          {/* Project Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-black">Project Description</label>
            <textarea
              placeholder="Enter project description"
              rows={10}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
            />
          </div>

          {/* Resume ZIP file */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-black">Resume ZIP file</label>
            <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setResumesZip(e.target.files[0])}
                className="w-full text-gray-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition cursor-pointer"
          >
            {loading ? "Processing..." : "Upload & Analyze"}
          </button>
        </form>
      </div>

      {/* Previous Job Uploads Section */}
      <div className="flex flex-col w-1/2 overflow-y-auto max-h-full bg-white p-6 rounded-2xl shadow-lg space-y-6">
    <h2 className="text-6xl font-extrabold text-center mb-8 w-full text-black">
      Previous Job Uploads
    </h2>

    {/* Grid of Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Example Card */}
      <div className="flex flex-col bg-gray-100 p-6 rounded-2xl shadow-md space-y-4 hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-gray-800">Software Developer</h3>
        <p className="text-sm text-gray-600">Uploaded: 26 April 2025, 10:00 AM</p>
        <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition cursor-pointer">
          View Analysis
        </button>
      </div>

      {/* Another Card */}
      <div className="flex flex-col bg-gray-100 p-6 rounded-2xl shadow-md space-y-4 hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-gray-800">Data Analyst</h3>
        <p className="text-sm text-gray-600">Uploaded: 25 April 2025, 2:30 PM</p>
        <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition cursor-pointer">
          View Analysis
        </button>
      </div>

      {/* Another Card */}
      <div className="flex flex-col bg-gray-100 p-6 rounded-2xl shadow-md space-y-4 hover:shadow-lg transition">
        <h3 className="text-xl font-bold text-gray-800">Project Manager</h3>
        <p className="text-sm text-gray-600">Uploaded: 24 April 2025, 11:15 AM</p>
        <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition cursor-pointer">
          View Analysis
        </button>
      </div>
    </div>
  </div>
    </main>
  );
}

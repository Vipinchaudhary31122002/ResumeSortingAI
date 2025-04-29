"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAllResumesByBatch } from "@/api/resumes";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);
  const searchParams = useSearchParams();
  const batchId = searchParams.get("id");

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        if (batchId) {
          const resumesData = await getAllResumesByBatch(batchId);

          // Log the fetched data to check the format
          console.log("Fetched Resumes Data: ", resumesData);

          // Ensure resumesData is an array
          setResumes(
            Array.isArray(resumesData.resumes) ? resumesData.resumes : []
          );
        }
      } catch (error) {
        console.error(error);
        setResumes([]); // Set empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [batchId]);
  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Skills",
      "Experience",
      "Education",
      "Certification",
      "JD Score",
      "ATS Score",
      "Keyword Match",
    ];

    const rows = resumes.map((r) => [
      r.name || "",
      r.email || "",
      r.phone || "",
      Array.isArray(r.skills) ? r.skills.join("; ") : r.skills || "",
      r.experience || "",
      r.education || "",
      r.certification || "",
      r.jd_score || "",
      r.ats_score || "",
      r.keyword_match || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((field) => `"${String(field).replace(/"/g, '""')}"`) // escape double quotes
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resumes_dashboard.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (resume) => {
    setCurrentResume(resume);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentResume(null);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-8">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Job Batch Analysis</h2>
          <button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
          >
            Download CSV
          </button>
        </div>

        {/* Table or Loading */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            Loading resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No resumes found.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold text-lg">Name</th>
                  <th className="px-6 py-4 font-semibold text-lg">Email</th>
                  <th className="px-6 py-4 font-semibold text-lg">Phone</th>
                  <th className="px-6 py-4 font-semibold text-lg">JD Score</th>
                  <th className="px-6 py-4 font-semibold text-lg">ATS Score</th>
                  <th className="px-6 py-4 font-semibold text-lg">
                    Keyword Match
                  </th>

                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-3 font-bold">{r.name}</td>
                    <td className="px-6 py-3 font-bold">{r.email}</td>
                    <td className="px-6 py-3 font-bold">{r.phone}</td>
                    <td className="px-6 py-3 font-bold">{r.jd_score}</td>
                    <td className="px-6 py-3 font-bold">{r.ats_score}</td>
                    <td className="px-6 py-3 font-bold">{r.keyword_match}%</td>
                    <td className="px-6 py-3 font-bold">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-full transition cursor-pointer"
                        onClick={() => openModal(r)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && currentResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-800 mb-1">
                {currentResume.name}
              </h3>
              <p className="text-md text-gray-500 italic">Candidate Overview</p>
            </div>

            <div className="border-t pt-4 space-y-3 text-gray-700">
              <p className="text-lg">
                <strong>Email:</strong> {currentResume.email}
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> {currentResume.phone}
              </p>
              <p className="text-lg">
                <strong>Experience:</strong> {currentResume.experience}
              </p>
              <p className="text-lg">
                <strong>Education:</strong> {currentResume.education}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(currentResume.skills)
                  ? currentResume.skills
                  : currentResume.skills?.split(",")
                ).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 text-lg font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span>JD Score:</span>
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg">
                  {currentResume.jd_score}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>ATS Score:</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                  {currentResume.ats_score}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Keyword Match:</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                  {currentResume.keyword_match}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                {currentResume.resume_url && (
                  <button
                    onClick={() =>
                      window.open(currentResume.resume_url, "_blank")
                    }
                    className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    View PDF
                  </button>
                )}
              </div>

              <div>
                <button
                  onClick={closeModal}
                  className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

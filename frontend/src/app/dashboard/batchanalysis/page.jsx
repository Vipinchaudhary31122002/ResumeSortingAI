"use client";
import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control the off-canvas modal
  const [currentResume, setCurrentResume] = useState(null); // Store the details of the selected resume

  // Sample resume data
  useEffect(() => {
    const mockData = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "1234567890",
        skills: ["python", "sql"],
        jd_score: "78.5",
        ats_score: "84.3",
        experience: "5 years",
        education: "B.Sc in Computer Science",
        resumeLink: "https://example.com/resume/alice.pdf", // Link to resume file
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "9876543210",
        skills: ["java", "communication"],
        jd_score: "68.0",
        ats_score: "72.0",
        experience: "3 years",
        education: "B.A in Communications",
        resumeLink: "https://example.com/resume/bob.pdf",
      },
    ];
    setResumes(mockData);
  }, []);

  const downloadCSV = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Skills", "JD Score", "ATS Score"],
      ...resumes.map((r) => [
        r.name,
        r.email,
        r.phone,
        r.skills.join(", "),
        r.jd_score,
        r.ats_score,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "resumes_dashboard.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to open modal with resume details
  const openModal = (resume) => {
    setCurrentResume(resume);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentResume(null);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-8">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Resume Dashboard</h2>
          <button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Download CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
              <tr>
                <th className="px-6 py-4 font-semibold text-lg">Name</th>
                <th className="px-6 py-4 font-semibold text-lg">Email</th>
                <th className="px-6 py-4 font-semibold text-lg">Phone</th>
                <th className="px-6 py-4 font-semibold text-lg">Skills</th>
                <th className="px-6 py-4 font-semibold text-lg">JD Score</th>
                <th className="px-6 py-4 font-semibold text-lg">ATS Score</th>
                <th className="px-6 py-4"></th> {/* No heading for buttons */}
              </tr>
            </thead>
            <tbody>
              {resumes.map((r, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.email}</td>
                  <td className="px-6 py-4">{r.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {r.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">{r.jd_score}%</td>
                  <td className="px-6 py-4">{r.ats_score}%</td>
                  <td className="px-6 py-4">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-full transition"
                        onClick={() => openModal(r)}
                      >
                        View Details
                      </button>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No resumes uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Off-canvas modal for "View Details" */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-8 shadow-lg overflow-y-auto">
            <h3 className="text-3xl font-semibold mb-4 text-black">{currentResume.name}</h3>
            <p className="text-lg mb-2 text-black">Email: {currentResume.email}</p>
            <p className="text-lg mb-2 text-black">Phone: {currentResume.phone}</p>
            <p className="text-lg mb-2 text-black">Experience: {currentResume.experience}</p>
            <p className="text-lg mb-2 text-black">Education: {currentResume.education}</p>
            <p className="text-lg mb-2 text-black">Skills:{" "}
              {currentResume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2"
                >
                  {skill}
                </span>
              ))}
            </p>
            <p className="text-lg mb-2 text-black">JD Score: {currentResume.jd_score}%</p>
            <p className="text-lg mb-4 text-black">ATS Score: {currentResume.ats_score}%</p>
            <div className="flex justify-between items-center">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Close
              </button>
              <button
                onClick={() => window.open(currentResume.resumeLink, "_blank")}
                className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Open Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

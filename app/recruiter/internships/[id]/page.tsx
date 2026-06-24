"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../Components/Navbar";

const initialApplicants = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    status: "Applied",
    resume:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },

  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 9988776655",
    status: "Shortlisted",
    resume:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];
const internshipDetails = {
  title: "Frontend Developer Intern",
  company: "StepUp Intern",
  location: "Hyderabad, India",
  jobType: "Internship",
  workspace: "Remote",
  stipend: "₹10,000 / month",
  deadline: "26 Jun 2026",

  overview:
    "We are looking for a talented Frontend Developer Intern to join our team and work on modern web applications using React, Next.js and Tailwind CSS.",

  responsibilities: [
    "Develop responsive web pages",
    "Build reusable React components",
    "Work with APIs",
    "Fix bugs and improve UI",
    "Collaborate with team members",
  ],

  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React.js",
    "Git & GitHub",
  ],

  learning: [
    "Real-world project experience",
    "Industry best practices",
    "Team collaboration",
    "Deployment workflows",
  ],

  perks: [
    "Certificate",
    "Letter of Recommendation",
    "Flexible Hours",
    "Remote Work",
  ],
};

export default function InternshipDetailsPage() {

  const [applicants, setApplicants] =
    useState(initialApplicants);

  const [openMenu, setOpenMenu] =
    useState<number | null>(null);

  const [showInterviewModal, setShowInterviewModal] =
    useState(false);

  const [selectedApplicant, setSelectedApplicant] =
    useState<any>(null);

  const [interviewDate, setInterviewDate] =
    useState("");

  const [interviewTime, setInterviewTime] =
    useState("");
  const [showResume, setShowResume] = useState(false);
  const [selectedResume, setSelectedResume] =
  useState("");
    

  const handleShortlist = (id: number) => {
    setApplicants((prev: any) =>
      prev.map((applicant: any) =>
        applicant.id === id
          ? {
              ...applicant,
              status: "Shortlisted",
            }
          : applicant
      )
    );

    setOpenMenu(null);
  };

  const handleReject = (id: number) => {
    setApplicants((prev: any) =>
      prev.map((applicant: any) =>
        applicant.id === id
          ? {
              ...applicant,
              status: "Rejected",
            }
          : applicant
      )
    );
    setOpenMenu(null);
  };

  const handleScheduleInterview = (
    applicant: any
  ) => {
    setSelectedApplicant(applicant);
    setShowInterviewModal(true);
    setOpenMenu(null);
  };

  const handleRemoveApplicant = (
    id: number
  ) => {
    setApplicants((prev: any) =>
      prev.filter(
        (applicant: any) =>
          applicant.id !== id
      )
    );

    setOpenMenu(null);
  };

  const handleSendEmail = (email: string) => {
  window.location.href = `mailto:${email}`;
};

const confirmInterview = () => {
  setApplicants((prev: any) =>
    prev.map((applicant: any) =>
      applicant.id === selectedApplicant.id
        ? {
            ...applicant,
            status: "Interview Scheduled",
            interviewDate,
            interviewTime,
          }
        : applicant
    )
  );

  setShowInterviewModal(false);
  setInterviewDate("");
  setInterviewTime("");
};
const totalApplicants = applicants.length;

const shortlisted = applicants.filter(
  (a: any) => a.status === "Shortlisted"
).length;

const interviews = applicants.filter(
  (a: any) =>
    a.status === "Interview Scheduled"
).length;

const rejected = applicants.filter(
  (a: any) => a.status === "Rejected"
).length;
return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

<div className="p-8">
    <h1 className="text-4xl font-bold">
  {internshipDetails.title}
</h1>

<p className="text-gray-500 mt-2">
  {internshipDetails.company}
</p>

<p className="text-gray-500">
  {internshipDetails.location}
</p>

{/* Back Button */}
<Link
  href="/recruiter"
  className="text-blue-600 font-medium"
>
  ← Back to Listings
</Link>

  {/* Internship Header */}
  <div className="bg-white border border-gray-200 rounded-xl p-6 mt-5">

    <h1 className="text-3xl font-bold">
      
      Frontend Developer Intern
    </h1>

    <p className="text-gray-500 mt-2">
      Computer Science • Remote • Hybrid
    </p>

    <div className="flex gap-4 mt-4">
      <span className="bg-gray-100 px-3 py-1 rounded-full">
        Posted: 10 Jun 2026
      </span>

      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
        Deadline: 25 Jun 2026
      </span>
    </div>

  </div>

  {/* ADD THE STATS CARDS HERE 👇 */}
  <div className="grid md:grid-cols-4 gap-5 mt-6">

    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">Total Applicants</p>
      <h3 className="text-3xl font-bold mt-2">
  {totalApplicants}
</h3>
    </div>

    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">Shortlisted</p>
      <h3 className="text-3xl font-bold mt-2 text-green-600">
  {shortlisted}
</h3>
    </div>

    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">Interviews</p>
      <h3 className="text-3xl font-bold mt-2 text-blue-600">
  {interviews}
</h3>
    </div>

    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">Rejected</p>
      <h3 className="text-3xl font-bold mt-2 text-red-600">
  {rejected}
</h3>
    </div>

  </div>
{/* Applicants Section */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">

  <h2 className="text-2xl font-semibold">
    Applicants
  </h2>

  <p className="text-sm text-gray-500 mt-1 mb-6">
    Review and manage talent pipeline
  </p>

  {/* Header Row */}
  <div className="grid grid-cols-6 gap-4 px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-200 mb-3">

    <div>Candidate</div>

    <div>Phone</div>

    <div>Current Status</div>

    <div></div>

    <div></div>

    <div>Actions</div>

  </div>

  <div className="space-y-3">

    {applicants.map((applicant) => (

      <div
        key={applicant.id}
        className="grid grid-cols-6 items-center gap-4 border border-gray-100 rounded-xl p-3"
      >

        {/* Candidate */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
            {applicant.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>

          <div>

            <p className="font-medium text-sm">
              {applicant.name}
            </p>

            <p className="text-xs text-gray-500">
              {applicant.email}
            </p>

          </div>

        </div>

        {/* Phone */}
        <div>

          <p className="text-xs text-gray-500">
            {applicant.phone}
          </p>

        </div>

        {/* Status */}
        <div>

          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              applicant.status === "Shortlisted"
                ? "bg-green-100 text-green-700"
                : applicant.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : applicant.status === "Interview Scheduled"
                ? "bg-purple-100 text-purple-700"
                : applicant.status === "Completed"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {applicant.status}
          </span>

        </div>

        {/* View Resume */}
        <div>

          <button
  onClick={() => {
    setSelectedResume(applicant.resume);
    setShowResume(true);
  }}
  className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-full text-xs font-medium hover:bg-blue-100"
>
  View Resume
</button>

        </div>

        {/* Download */}
        <div>

          <a
            href={applicant.resume}
            download
            className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-100"
          >
            Download Resume
          </a>

        </div>

        {/* Actions */}
        <div className="relative">

          <button
            onClick={() =>
              setOpenMenu(
                openMenu === applicant.id
                  ? null
                  : applicant.id
              )
            }
            className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-100"
          >
            More ▼
          </button>

          {openMenu === applicant.id && (

            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

              <button
                onClick={() =>
                  handleShortlist(applicant.id)
                }
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                ⭐ Shortlist
              </button>

              <button
                onClick={() =>
                  handleScheduleInterview(applicant)
                }
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                📅 Schedule Interview
              </button>

              <button
                onClick={() =>
                  handleReject(applicant.id)
                }
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
              >
                ❌ Reject Candidate
              </button>

              <button
                onClick={() =>
                  handleSendEmail(applicant.email)
                }
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                ✉️ Send Email
              </button>

              <button
                onClick={() =>
                  handleRemoveApplicant(applicant.id)
                }
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
              >
                🗑️ Remove Application
              </button>

            </div>

          )}

        </div>

      </div>

    ))}

  </div>

</div>
{/* Interview Modal */}
{showInterviewModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-[450px]">

      <h2 className="text-2xl font-bold mb-5">
        Schedule Interview
      </h2>

      <input
        type="date"
        value={interviewDate}
        onChange={(e) =>
          setInterviewDate(e.target.value)
        }
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="time"
        value={interviewTime}
        onChange={(e) =>
          setInterviewTime(e.target.value)
        }
        className="w-full border rounded-lg p-3 mb-5"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowInterviewModal(false)
          }
          className="border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={confirmInterview}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Schedule
        </button>

      </div>

    </div>

  </div>
)}
{showResume && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white w-[95%] h-[90vh] rounded-2xl overflow-hidden">

      <div className="flex justify-between items-center p-5 border-b">

        <h2 className="text-xl font-semibold">
          Resume Preview
        </h2>

        <button
          onClick={() => setShowResume(false)}
          className="text-2xl"
        >
          ×
        </button>

      </div>

      <iframe
        src={selectedResume}
        className="w-full h-[75vh]"
      />

      <div className="p-5 border-t flex justify-end gap-3">

        <a
          href={selectedResume}
          download
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Download Resume
        </a>

        <button
          onClick={() => setShowResume(false)}
          className="border px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

      </div>
    </div>
  );
}
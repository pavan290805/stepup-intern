"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../Components/Navbar";

const initialInternships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    duration: "3 Months",
    stipend: "₹10,000",
    applicants: 25,
    status: "Active",
    applicantsList: [
      {
        id: 1,
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 2,
        name: "Priya Sharma",
        email: "priya@gmail.com",
        resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },

  {
    id: 2,
    title: "AI/ML Intern",
    duration: "6 Months",
    stipend: "₹15,000",
    applicants: 18,
    status: "Active",
  },

  {
    id: 3,
    title: "UI/UX Designer Intern",
    duration: "2 Months",
    stipend: "₹8,000",
    applicants: 12,
    status: "Closed",
  },

  {
    id: 4,
    title: "Backend Developer Intern",
    duration: "4 Months",
    stipend: "₹12,000",
    applicants: 20,
    status: "Active",
  },
];
export default function RecruiterPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [internships, setInternships] = useState(initialInternships);
  const activeInternships = internships.filter(
  (i) => i.status === "Active"
).length;

const totalApplicants = internships.reduce(
  (sum, i) => sum + i.applicants,
  0
);

const interviewsScheduled = internships.reduce(
  (sum, internship) =>
    sum + Math.floor(internship.applicants * 0.15),
  0
);

const hiringRate =
  totalApplicants > 0
    ? Math.round((12 / totalApplicants) * 100)
    : 0;
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || internship.status === filter;

    return matchesSearch && matchesFilter;
  });
  const handleClose = (id: number) => {
  setInternships((prev) =>
    prev.map((item) =>
      item.id === id
        ? { ...item, status: "Closed" }
        : item
    )
  );
};

const handleDelete = (id: number) => {
  setInternships((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

return (
  <div className="min-h-screen bg-[#F8FAFC]">
    <Navbar />

    <div className="p-8">

        <div className="p-8">
<div className="flex justify-between items-center mb-8">

  <div>
    <h1 className="text-3xl font-bold text-gray-900">
      Internship Management
    </h1>

    <p className="text-gray-500 mt-1">
      Manage internships, applicants and hiring pipeline.
    </p>
  </div>

  <Link
    href="/recruiter/create-internship"
    className="bg-[#2563EB] text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
  >
    + Create Internship
  </Link>

</div>

<div className="grid md:grid-cols-4 gap-5 mb-8">

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Active Internships
    </p>

    <h3 className="text-3xl font-bold mt-2">
      {activeInternships}
    </h3>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Total Applicants
    </p>

    <h3 className="text-3xl font-bold mt-2">
  {totalApplicants}
</h3>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Interviews Scheduled
    </p>

    <h3 className="text-3xl font-bold mt-2">
      {interviewsScheduled}
    </h3>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Hiring Rate
    </p>

    <h3 className="text-3xl font-bold mt-2">
  {hiringRate}%
</h3>
  </div>

</div>
{/* Search & Filters */}
<div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">

  <div className="flex flex-wrap gap-4 items-center">

    <input
      type="text"
      placeholder="Search internship..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 min-w-[300px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={() => setFilter("All")}
      className={`px-4 py-2 rounded-lg ${
        filter === "All"
          ? "bg-blue-600 text-white"
          : "bg-gray-100"
      }`}
    >
      All
    </button>

    <button
      onClick={() => setFilter("Active")}
      className={`px-4 py-2 rounded-lg ${
        filter === "Active"
          ? "bg-green-600 text-white"
          : "bg-green-100 text-green-700"
      }`}
    >
      Active
    </button>

    <button
      onClick={() => setFilter("Closed")}
      className={`px-4 py-2 rounded-lg ${
        filter === "Closed"
          ? "bg-red-600 text-white"
          : "bg-red-100 text-red-700"
      }`}
    >
      Closed
    </button>

  </div>

</div>
<div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
  <div className="space-y-5 p-5">

  {filteredInternships.map((internship) => (

    <div
      key={internship.id}
      className="bg-white border border-gray-200 rounded-xl p-6"
    >

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-3">

            <h3 className="text-xl font-semibold">
              {internship.title}
            </h3>
            <p className="text-gray-500 mt-2">
  Computer Science • Remote • Hybrid
</p>

            <span
              className={`px-3 py-1 rounded-full text-xs ${
                internship.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {internship.status}
            </span>

          </div>

<p className="text-gray-500 text-sm mt-4 max-w-3xl">
  We are looking for a talented {internship.title} to join our team.
  You will work on building responsive and dynamic web applications
  using modern technologies.
</p>

<p className="text-sm text-gray-600 mt-3">
  Compensation:
  <span className="font-semibold ml-1">
    {internship.stipend}
  </span>

  <span className="mx-2">•</span>

  Deadline:
  <span className="font-semibold ml-1">
    26 Jun 2026
  </span>
</p>

<div className="flex flex-wrap gap-4 mt-4">
  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
    ⏳ {internship.duration}
  </span>

  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
    💰 {internship.stipend}
  </span>

  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
    👥 {internship.applicants} Applicants
  </span>

</div>

        </div>

        <div className="flex flex-wrap gap-3">

<div className="flex flex-col items-end gap-2">

  <div className="flex flex-wrap gap-2">

    <Link
      href={`/recruiter/internships/${internship.id}`}
      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200"
    >
      View Applicants
    </Link>

    <Link
      href={`/recruiter/edit/${internship.id}`}
      className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
    >
      Edit
    </Link>

    <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
      Feature
    </button>

    <button
      onClick={() => handleClose(internship.id)}
      className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg"
    >
      Close
    </button>

  </div>

  <button
    onClick={() => handleDelete(internship.id)}
    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
  >
    Delete
  </button>

</div>
        </div>

      </div>

    </div>

  ))}

</div>
</div>

        </div>
      </div>
    </div>
  );
}
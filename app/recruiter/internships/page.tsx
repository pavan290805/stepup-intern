"use client";

import Link from "next/link";
import { useState, Fragment } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

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
export default function InternshipsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [internships, setInternships] = useState(initialInternships);

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || internship.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Internship Management
            </h1>

            <Link
              href="/recruiter/create-internship"
              className="bg-[#1E88E5] text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              + Create Internship
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Total Internships</h3>
              <p className="text-3xl font-bold text-[#1E88E5]">
                {internships.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Active</h3>
              <p className="text-3xl font-bold text-green-600">
                {
                  internships.filter(
                    (i) => i.status === "Active"
                  ).length
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Closed</h3>
              <p className="text-3xl font-bold text-red-600">
                {
                  internships.filter(
                    (i) => i.status === "Closed"
                  ).length
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Applicants</h3>
              <p className="text-3xl font-bold text-purple-600">
                75
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search Internship..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />

            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-lg ${
                filter === "All"
                  ? "bg-[#1E88E5] text-white"
                  : "bg-gray-100"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("Active")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setFilter("Closed")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Closed"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Closed
            </button>
          </div>
<div className="bg-white rounded-2xl shadow overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="text-left p-4">Title</th>
        <th className="text-left p-4">Duration</th>
        <th className="text-left p-4">Stipend</th>
        <th className="text-left p-4">Applicants</th>
        <th className="text-left p-4">Status</th>
        <th className="text-left p-4">Action</th>
      </tr>
    </thead>

<tbody>
{filteredInternships.map((internship) => (
  <Fragment key={internship.id}>
      <tr className="border-t hover:bg-blue-50">
        <td className="p-4 font-medium">
          {internship.title}
        </td>

        <td className="p-4">
          {internship.duration}
        </td>

        <td className="p-4">
          {internship.stipend}
        </td>

        <td className="p-4">
          {internship.applicants}
        </td>

        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              internship.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {internship.status}
          </span>
        </td>

        <td className="p-4">
          <button
            onClick={() =>
              setSelectedInternship(
                selectedInternship?.id === internship.id
                  ? null
                  : internship
              )
            }
            className="bg-[#1E88E5] text-white px-4 py-2 rounded-lg"
          >
            View
          </button>
        </td>
      </tr>

      {selectedInternship?.id === internship.id && (
        <tr>
          <td colSpan={6} className="bg-gray-50 p-6">

            <h3 className="text-2xl font-bold mb-4">
              Internship Details
            </h3>

            <p>
              <strong>Title:</strong> {internship.title}
            </p>

            <p>
              <strong>Duration:</strong> {internship.duration}
            </p>

            <p>
              <strong>Stipend:</strong> {internship.stipend}
            </p>

            <p>
              <strong>Applicants:</strong> {internship.applicants}
            </p>

            <p>
              <strong>Status:</strong> {internship.status}
            </p>

            {internship.applicantsList && (
              <div className="mt-6">
                <h4 className="text-xl font-bold mb-4">
                  Applicants
                </h4>

                {internship.applicantsList.map(
                  (candidate: any) => (
                    <div
                      key={candidate.id}
                      className="border rounded-xl p-4 mb-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {candidate.name}
                        </p>

                        <p className="text-gray-500">
                          {candidate.email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              candidate.resume,
                              "_blank"
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-2 rounded"
                        >
                          View Resume
                        </button>

                        <a
                          href={candidate.resume}
                          download
                          className="bg-green-600 text-white px-3 py-2 rounded"
                        >
                          Download Resume
                        </a>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          </td>
        </tr>
      )}
</Fragment>
  ))}
</tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
}
"use client";
import Link from "next/link";
import { useState } from "react";
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
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [internships, setInternships] = useState(initialInternships);
  const [showForm, setShowForm] = useState(false);
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
                  <tr
                    key={internship.id}
                    className="border-t hover:bg-blue-50"
                  >
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
                          setSelectedInternship(internship)
                        }
                        className="bg-[#1E88E5] text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedInternship && (
            <div className="bg-white rounded-2xl shadow p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">
                Internship Details
              </h2>

              <p>
                <strong>Title:</strong>{" "}
                {selectedInternship.title}
              </p>

              <p>
                <strong>Duration:</strong>{" "}
                {selectedInternship.duration}
              </p>

              <p>
                <strong>Stipend:</strong>{" "}
                {selectedInternship.stipend}
              </p>

              <p>
                <strong>Applicants:</strong>{" "}
                {selectedInternship.applicants}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedInternship.status}
              </p>

              <div className="flex gap-3 mt-4">
<button
  onClick={() => {
    const updatedInternships = internships.map((item) =>
      item.id === selectedInternship.id
        ? { ...item, status: "Closed" }
        : item
    );

    setInternships(updatedInternships);

    setSelectedInternship({
      ...selectedInternship,
      status: "Closed",
    });
  }}
  className="bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Close Internship
</button>

                <button
                  onClick={() =>
                    setSelectedInternship(null)
                  }
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
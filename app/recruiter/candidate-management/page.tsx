"use client";

import { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

const initialCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    skills: "React, Next.js",
    status: "Pending",
    appliedOn: "15 Jun 2026",
  },
  {
    id: 2,
    name: "Alice Smith",
    email: "alice@gmail.com",
    skills: "Python, Machine Learning",
    status: "Shortlisted",
    appliedOn: "14 Jun 2026",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    skills: "Java, Spring Boot",
    status: "Rejected",
    appliedOn: "13 Jun 2026",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    skills: "UI/UX, Figma",
    status: "Shortlisted",
    appliedOn: "12 Jun 2026",
  },
];

export default function CandidateManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [candidateStatus, setCandidateStatus] = useState("");
  const [candidateList, setCandidateList] = useState(initialCandidates);

const filteredCandidates = candidateList.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || candidate.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Candidate Management
          </h1>

          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Visible Candidates</h3>
              <p className="text-3xl font-bold text-[#1E88E5]">
                {filteredCandidates.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Shortlisted</h3>
              <p className="text-3xl font-bold text-green-600">
                {candidateList.filter(
                  (c) => c.status === "Shortlisted"
                ).length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Pending</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {candidateList.filter(
                  (c) => c.status === "Pending"
                ).length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">Rejected</h3>
              <p className="text-3xl font-bold text-red-500">
                {candidateList.filter(
                  (c) => c.status === "Rejected"
                ).length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Interviews Scheduled
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                8
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search Candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />

            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "All"
                  ? "bg-[#1E88E5] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("Shortlisted")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "Shortlisted"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Shortlisted
            </button>

            <button
              onClick={() => setFilter("Pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "Pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("Rejected")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "Rejected"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Candidate</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Skills</th>
                  <th className="text-left p-4">Applied On</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-t hover:bg-blue-50 transition duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1E88E5] text-white rounded-full flex items-center justify-center font-bold">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <span>{candidate.name}</span>
                      </div>
                    </td>

                    <td className="p-4">{candidate.email}</td>

                    <td className="p-4">{candidate.skills}</td>

                    <td className="p-4 text-gray-600">
                      {candidate.appliedOn}
                    </td>

                    <td className="p-4">
                      {candidate.status === "Pending" && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      )}

                      {candidate.status === "Shortlisted" && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Shortlisted
                        </span>
                      )}

                      {candidate.status === "Rejected" && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
<button
  onClick={() => {
    setSelectedCandidate(candidate);
    setCandidateStatus(candidate.status);
  }}
  className="bg-[#1E88E5] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  View
</button>

<button
  onClick={() =>
    window.open(
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "_blank"
    )
  }
  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-black transition"
>
  Resume
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

{selectedCandidate && (
  <div className="bg-white rounded-2xl shadow p-8 mt-6 border-l-4 border-[#1E88E5]">
    <h2 className="text-2xl font-bold mb-4">
      Candidate Details
    </h2>

    <p><strong>Name:</strong> {selectedCandidate.name}</p>
<p><strong>Email:</strong> {selectedCandidate.email}</p>

<p>
  <strong>Phone:</strong> +91 9876543210
</p>

<p>
  <strong>College:</strong> KLH University
</p>

<p>
  <strong>Degree:</strong> B.Tech CSE
</p>

<p>
  <strong>CGPA:</strong> 8.7
</p>

<p>
  <strong>Skills:</strong> {selectedCandidate.skills}
</p>

<p>
  <strong>Applied On:</strong> {selectedCandidate.appliedOn}
</p>

<p>
  <strong>Experience:</strong> Fresher
</p>

<p>
  <strong>Resume:</strong>

  <button
    onClick={() =>
      window.open(
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "_blank"
      )
    }
    className="ml-2 text-blue-600 hover:underline"
  >
    View Resume
  </button>
</p>

    <p className="mt-2">
      <strong>Status:</strong> {candidateStatus}
    </p>

    <div className="flex gap-3 mt-4">
<button
  onClick={() => {
    setCandidateStatus("Shortlisted");

    setCandidateList(
      candidateList.map((c) =>
        c.id === selectedCandidate.id
          ? { ...c, status: "Shortlisted" }
          : c
      )
    );

    setSelectedCandidate({
      ...selectedCandidate,
      status: "Shortlisted",
    });
  }}
  className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
  Shortlist
</button>

      <button
  onClick={() => {
    setCandidateStatus("Rejected");

    setCandidateList(
      candidateList.map((c) =>
        c.id === selectedCandidate.id
          ? { ...c, status: "Rejected" }
          : c
      )
    );

    setSelectedCandidate({
      ...selectedCandidate,
      status: "Rejected",
    });
  }}
  className="bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Reject
</button>
<button
  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
  Schedule Interview
</button>

      <button
        onClick={() => setSelectedCandidate(null)}
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
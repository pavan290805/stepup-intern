"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../Components/Navbar";

const initialInternships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    domain: "Computer Science",
    type: "Remote • Hybrid",
    duration: "3 Months",
    stipend: "₹10,000",
    applicants: 148,
    daysLeft: 12,
    status: "Active",
    postedAgo: "2 days ago",
    tags: ["React", "Tailwind CSS", "TypeScript"],
    description:
      "We are looking for a talented Frontend Developer Intern to join our team. You will work on building responsive and dynamic web applications using modern technologies.",
    applicantsList: [
      {
        id: 1,
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        resume:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 2,
        name: "Priya Sharma",
        email: "priya@gmail.com",
        resume:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: 2,
    title: "UI/UX Design Intern",
    domain: "Design",
    type: "San Francisco",
    duration: "2 Months",
    stipend: "₹8,000",
    applicants: 45,
    daysLeft: 3,
    status: "Active",
    postedAgo: "5 days ago",
    tags: ["Figma", "Prototyping"],
    description:
      "Join our design team to create stunning user experiences for our platform.",
  },
  {
    id: 3,
    title: "Backend Engineer Intern",
    domain: "Engineering",
    type: "Hybrid",
    duration: "4 Months",
    stipend: "₹12,000",
    applicants: 12,
    daysLeft: 18,
    status: "Active",
    postedAgo: "1 week ago",
    tags: ["Node.js", "PostgreSQL"],
    description:
      "Work on scalable backend systems and APIs powering our platform.",
  },
  {
    id: 4,
    title: "AI/ML Intern",
    domain: "Engineering",
    type: "Remote",
    duration: "6 Months",
    stipend: "₹15,000",
    applicants: 18,
    daysLeft: 0,
    status: "Closed",
    postedAgo: "2 weeks ago",
    tags: ["Python", "PyTorch"],
    description:
      "Research and implement machine learning models for our core product.",
  },
];

const activityFeed = [
  {
    id: 1,
    text: "Alex Johnson",
    action: "applied for Frontend Intern",
    time: "2 minutes ago",
    color: "#3B82F6",
  },
  {
    id: 2,
    text: "Interview scheduled",
    action: "with Sarah Chen",
    time: "1 hour ago",
    color: "#8B5CF6",
  },
  {
    id: 3,
    text: "New message from",
    action: "Hiring Manager",
    time: "3 hours ago",
    color: "#10B981",
  },
  {
    id: 4,
    text: "Profile updated:",
    action: "Marcus Wright",
    time: "Yesterday",
    color: "#6B7280",
  },
];

export default function RecruiterPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [internships, setInternships] = useState(initialInternships);

  const totalListings = internships.length;
  const activeListings = internships.filter((i) => i.status === "Active").length;
  const totalApplicants = 1892;
  const hiringRate = 68;

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || internship.status === filter;
    return matchesSearch && matchesFilter;
  });

  const latestPosting = filteredInternships[0];
  const otherPostings = filteredInternships.slice(1);

  const handleClose = (id: number) => {
    setInternships((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Closed" } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setInternships((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Recruiter Dashboard</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Manage internships with one focused workspace.
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Create listings, publish them when ready and manage applicants from
              one place.
            </p>
          </div>
          <Link
            href="/recruiter/create-internship"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
          >
            + Create Internship
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Total Listings
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {totalListings}
            </h3>
            <p className="text-xs text-green-600 mt-1">↑ +12%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Active Listings
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {activeListings}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {internships.filter((i) => i.daysLeft <= 5 && i.status === "Active").length} expiring soon
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Students Applied
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {totalApplicants.toLocaleString()}
            </h3>
            <p className="text-xs text-green-600 mt-1">↑ +24%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Hiring Rate
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {hiringRate}%
            </h3>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${hiringRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search job titles or departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[240px] border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              {["All Posts", "Active", "Closed", "Drafts"].map((f) => {
                const val = f === "All Posts" ? "All" : f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(val)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === val
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content: listings + activity sidebar */}
        <div className="flex gap-6">
          {/* Left: Listings */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Internship Listings</p>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Latest Posting
                </h2>
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                View all posts
              </button>
            </div>

            {/* Latest posting — full card */}
            {latestPosting && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {latestPosting.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {latestPosting.domain} • {latestPosting.type} •
                          Published {latestPosting.postedAgo}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-600">
                          {latestPosting.applicants}
                        </p>
                        <p className="text-xs text-gray-400">Applicants</p>
                        {latestPosting.daysLeft > 0 && (
                          <>
                            <p className="text-lg font-bold text-red-500 mt-1">
                              {latestPosting.daysLeft}
                            </p>
                            <p className="text-xs text-gray-400">Days left</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {latestPosting.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {latestPosting.tags && latestPosting.tags.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          +2 more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/recruiter/internships/${latestPosting.id}`}
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        View Applicants
                      </Link>
                      <Link
                        href={`/recruiter/edit/${latestPosting.id}`}
                        className="flex items-center gap-1.5 border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </Link>
                      <button className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Feature Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other postings — compact cards */}
            <div className="grid grid-cols-2 gap-4">
              {otherPostings.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {internship.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        internship.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {internship.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {internship.domain} • {internship.type} •{" "}
                    {internship.applicants} Applicants
                  </p>
                  {internship.daysLeft > 0 ? (
                    <p className="text-xs text-gray-400">
                      ⏳ Expires in {internship.daysLeft} days
                    </p>
                  ) : (
                    <p className="text-xs text-red-400">Listing closed</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/recruiter/internships/${internship.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Applicants
                    </Link>
                    {internship.status === "Active" && (
                      <>
                        <span className="text-gray-300">·</span>
                        <button
                          onClick={() => handleClose(internship.id)}
                          className="text-xs text-orange-500 hover:underline"
                        >
                          Close
                        </button>
                        <span className="text-gray-300">·</span>
                        <button
                          onClick={() => handleDelete(internship.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar: Activity feed + Pro tip */}
          <div className="w-72 shrink-0">
            {/* Activity Feed */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Activity Feed
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v4l3 3" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-blue-600">
                          {item.text}
                        </span>{" "}
                        {item.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition">
                View Full History
              </button>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-semibold">Pro Tip</span>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Listings with a "Day in the Life" section get 35% more quality
                applicants. Try adding one to your Frontend post!
              </p>
              <button className="mt-4 w-full bg-white text-blue-600 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition">
                Update Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
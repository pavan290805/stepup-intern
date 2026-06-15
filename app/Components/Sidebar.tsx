"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1E88E5] text-white p-6 shadow-xl">

      <div className="mb-12">
        <h1 className="text-4xl font-bold">
          StepUp
        </h1>

        <h2 className="text-4xl font-bold text-black">
          Intern
        </h2>
      </div>

      <div className="flex flex-col gap-3">

        <Link
          href="/recruiter"
          className="p-3 rounded-xl hover:bg-white/20 transition duration-300"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/recruiter/company-profile"
          className="p-3 rounded-xl hover:bg-white/20 transition duration-300"
        >
          🏢 Company Profile
        </Link>

        <Link
          href="/recruiter/candidate-management"
          className="p-3 rounded-xl hover:bg-white/20 transition duration-300"
        >
          👥 Candidate Management
        </Link>

        <Link
          href="/"
          className="p-3 rounded-xl hover:bg-red-500/30 transition duration-300 mt-6"
        >
          🚪 Logout
        </Link>

      </div>

      <div className="absolute bottom-6 left-6 text-sm opacity-80">
        Recruiter Portal
      </div>

    </div>
  );
}
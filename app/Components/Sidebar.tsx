"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">
        StepUp Recruiter
      </h1>

      <div className="flex flex-col gap-4">
        <Link href="/recruiter">Dashboard</Link>

        <Link href="/recruiter/company-profile">
          Company Profile
        </Link>

        <Link href="/recruiter/candidate-management">
          Candidate Management
        </Link>

        <Link href="/">Logout</Link>
      </div>
    </div>
  );
}
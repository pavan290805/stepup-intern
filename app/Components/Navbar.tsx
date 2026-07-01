"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm">

      {/* Left Side */}
      <div className="flex items-center gap-8">

        <h1 className="text-xl font-bold">
          <span className="text-blue-600">StepUp</span>
          <span className="text-black"> Intern</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          <Link
            href="/recruiter"
            className="text-blue-600 border-b-2 border-blue-600 pb-1"
          >
            Dashboard
          </Link>

          <Link
            href="/recruiter/interviews"
            className="text-gray-600 hover:text-blue-600"
          >
            Interviews
          </Link>

          <Link
            href="/recruiter/analytics"
            className="text-gray-600 hover:text-blue-600"
          >
            Analytics
          </Link>

          <Link
            href="/recruiter/profile"
            className="text-gray-600 hover:text-blue-600"
          >
            Profile
          </Link>

        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        <Link
          href="/recruiter/create-internship"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Create
        </Link>

        <button className="text-gray-500 hover:text-blue-600 text-lg">
          🔔
        </button>

        <button className="text-gray-500 hover:text-blue-600 text-lg">
          ⚙️
        </button>

        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
          👤
        </div>

      </div>

    </nav>
  );
}
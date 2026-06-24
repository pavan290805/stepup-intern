"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuClass = (path: string) =>
    `flex items-center px-4 py-3 rounded-xl transition ${
      pathname === path
        ? "bg-blue-600 text-white font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-72 min-h-screen bg-white border-r border-gray-200">

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold">
          Recruiter Portal
        </p>

        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          StepUp Intern
        </h1>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">

        <Link
          href="/recruiter"
          className={menuClass("/recruiter")}
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/recruiter"
          className={menuClass("/recruiter/internships")}
        >
          💼 Internship Management
        </Link>

        <Link
          href="/recruiter/analytics"
          className={menuClass("/recruiter/analytics")}
        >
          📊 Analytics
        </Link>

        <Link
          href="/recruiter/profile"
          className={menuClass("/recruiter/profile")}
        >
          👤 Profile
        </Link>

      </div>

      {/* Internship Summary */}
      <div className="px-4 mt-8">

        <div className="bg-blue-600 text-white rounded-2xl p-5">

          <p className="text-sm opacity-80">
            Live Status
          </p>

          <h3 className="text-3xl font-bold mt-2">
            8
          </h3>

          <p className="text-sm mt-1">
            Active Listings
          </p>

          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
            Create Internship
          </button>

        </div>

      </div>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button className="w-full border border-gray-200 rounded-xl py-3 text-red-500 hover:bg-red-50">
          Logout
        </button>
      </div>

    </div>
  );
}
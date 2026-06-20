"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuClass = (path: string) =>
    `flex items-center gap-3 h-14 px-5 rounded-xl transition-all duration-300 ${
      pathname === path
        ? "bg-white text-[#1E88E5] font-semibold shadow-md"
        : "text-white hover:bg-white/20"
    }`;

  return (
    <div className="w-72 min-h-screen bg-[#1E88E5] text-white p-6 shadow-xl flex flex-col">


      <div className="mb-12">
        <h1 className="text-5xl font-bold">
          StepUp
        </h1>

        <h2 className="text-5xl font-bold text-black">
          Intern
        </h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">

        <Link
          href="/recruiter"
          className={menuClass("/recruiter")}
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/recruiter/internships"
          className={menuClass("/recruiter/internships")}
        >
          💼 Internship Management
        </Link>

        <Link
          href="/recruiter/interviews"
          className={menuClass("/recruiter/interviews")}
        >
          📅 Interviews
        </Link>

        <Link
          href="/recruiter/analytics"
          className={menuClass("/recruiter/analytics")}
        >
          📊 Analytics
        </Link>

      </div>
    </div>
  );
}
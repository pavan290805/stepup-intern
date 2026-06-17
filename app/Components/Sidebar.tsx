"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuClass = (path: string) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      pathname === path
        ? "bg-white text-[#1E88E5] font-semibold"
        : "hover:bg-white/20"
    }`;

  return (
    <div className="w-64 min-h-screen bg-[#1E88E5] text-white p-6 shadow-xl">

      <div className="mb-12">
        <h1 className="text-5xl font-bold">
          StepUp
        </h1>

        <h2 className="text-5xl font-bold text-black">
          Intern
        </h2>
      </div>

      <div className="flex flex-col gap-3">

        <Link href="/recruiter" className={menuClass("/recruiter")}>
          🏠 Dashboard
        </Link>

        <Link
          href="/recruiter/company-profile"
          className={menuClass("/recruiter/company-profile")}
        >
          🏢 Company Profile
        </Link>

        <Link
          href="/recruiter/candidate-management"
          className={menuClass("/recruiter/candidate-management")}
        >
          👥 Candidate Management
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/30 transition mt-6"
        >
          🚪 Logout
        </Link>

      </div>
    </div>
  );
}
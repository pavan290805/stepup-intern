"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type HeaderProps = {
  onCreate?: () => void;
};

export default function Header({ onCreate }: HeaderProps) {
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "";

  const baseItem = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition";
  const activeClass = (p: string) =>
    baseItem +
    (p === page || (p === "dashboard" && !page)
      ? " bg-[#E8F2FF] text-[#0B5CC4] shadow-sm"
      : " text-slate-600 hover:bg-slate-100 hover:text-slate-900");

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="leading-none">
            <p className="text-xl font-bold tracking-tight text-[#0880EF] sm:text-2xl">StepUp</p>
            <p className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Intern</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#0880EF]">Recruiter Portal</p>
            <h1 className="text-2xl font-bold tracking-tight text-[#083B87] sm:text-[1.75rem]">Recruiter Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {onCreate ? (
              <button type="button" onClick={onCreate} className={activeClass("dashboard")}>Create Internship</button>
            ) : (
              <Link href="/" className={activeClass("dashboard")}>Create Internship</Link>
            )}
            <Link href="/?page=edit-internships" className={activeClass("edit-internships")}>Edit Internship</Link>
            <Link href="/?page=close-internships" className={activeClass("close-internships")}>Close Internship</Link>
            <Link href="/?page=featured-internships" className={activeClass("featured-internships")}>Featured Internship Promotion</Link>
            <Link href="/?page=interviews" className={activeClass("interviews")}>Interviews</Link>
          </nav>

          <button type="button" className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50">Logout</button>
        </div>
      </div>
    </header>
  );
}

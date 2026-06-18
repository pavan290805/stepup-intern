"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Internship, useRecruiterInternships } from "./useRecruiterInternships";

export default function FeaturedInternshipsPage() {
  const { internships, stats, promoteListing } = useRecruiterInternships();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"deadline" | "recent" | "title">("deadline");

  const openInternships = useMemo(
    () => internships.filter((internship) => internship.status !== "Closed"),
    [internships],
  );

  const filteredInternships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const source = normalizedQuery
      ? openInternships.filter((internship) => {
          return (
            internship.title.toLowerCase().includes(normalizedQuery) ||
            internship.department.toLowerCase().includes(normalizedQuery) ||
            internship.location.toLowerCase().includes(normalizedQuery)
          );
        })
      : openInternships;

    return [...source].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [openInternships, query, sortBy]);

  const featuredInternships = useMemo(
    () => openInternships.filter((internship) => internship.featured),
    [openInternships],
  );

  const selectedInternship =
    filteredInternships.find((internship) => internship.id === selectedId) ||
    featuredInternships[0] ||
    filteredInternships[0] ||
    null;

  const formatDate = (value: string) => {
    if (!value) {
      return "Not set";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const promoteNextDeadline = () => {
    const candidate = [...openInternships]
      .filter((internship) => !internship.featured)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

    if (candidate) {
      promoteListing(candidate.id);
      setSelectedId(candidate.id);
    }
  };

  const promoteNewestThree = () => {
    const candidates = [...openInternships]
      .filter((internship) => !internship.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    candidates.forEach((internship) => promoteListing(internship.id));
    if (candidates[0]) {
      setSelectedId(candidates[0].id);
    }
  };

  const clearFeatured = () => {
    featuredInternships.forEach((internship) => promoteListing(internship.id));
    setSelectedId(null);
  };

  const toggleFeature = (internship: Internship) => {
    promoteListing(internship.id);
    setSelectedId(internship.id);
  };

  const conversionRate = openInternships.length
    ? Math.round((featuredInternships.length / openInternships.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="leading-none">
              <p className="text-xl font-bold tracking-tight text-[#0880EF] sm:text-2xl">StepUp</p>
              <p className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Intern</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#0880EF]">
                Recruiter Portal
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-[#083B87] sm:text-[1.75rem]">
                Featured Promotion Dashboard
              </h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Create Internship
            </Link>
            <Link
              href="/?page=edit-internships"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Edit Internship
            </Link>
            <Link
              href="/?page=close-internships"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Close Internship
            </Link>
            <Link
              href="/?page=featured-internships"
              className="rounded-full bg-[#E8F2FF] px-4 py-2 text-sm font-medium text-[#0B5CC4] shadow-sm"
            >
              Featured Internship Promotion
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-medium text-slate-500">Promotion Command Center</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Spotlight internships that need faster applications
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This dashboard is dedicated to promotion strategy: identify listings with priority deadlines,
              elevate them as featured, and monitor campaign mix in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Open Listings" value={openInternships.length} />
            <StatTile label="Featured Now" value={featuredInternships.length} />
            <StatTile label="Promotion Rate" value={`${conversionRate}%`} />
            <StatTile label="Total Listings" value={stats[0]?.value ?? 0} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-900">Promotion Queue</h3>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "deadline" | "recent" | "title")}
                  className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#0880EF]"
                >
                  <option value="deadline">Sort: Earliest deadline</option>
                  <option value="recent">Sort: Most recent</option>
                  <option value="title">Sort: Title A-Z</option>
                </select>
                <label className="flex items-center rounded-full border border-slate-300 px-3 py-2">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search listing"
                    className="w-40 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>
            </div>

            {filteredInternships.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#C9DDF8] bg-[linear-gradient(180deg,#f7fbff,#eef5ff)] px-6 py-12 text-center">
                <h4 className="text-lg font-semibold text-slate-900">No internships available for promotion</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Create open listings first, then return here to run promotion campaigns.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInternships.map((internship) => (
                  <article
                    key={internship.id}
                    className="rounded-2xl border border-slate-200 bg-[#FBFDFF] p-4 transition hover:border-[#B8D8FF]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold text-slate-900">{internship.title}</h4>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              internship.featured
                                ? "bg-amber-100 text-amber-700"
                                : "bg-[#EAF2FF] text-[#0B5CC4]"
                            }`}
                          >
                            {internship.featured ? "Featured" : "Standard"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {internship.department} · {internship.location}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Deadline {formatDate(internship.deadline)} · Status {internship.status}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(internship.id)}
                          className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-[#0880EF] hover:text-[#0880EF]"
                        >
                          Spotlight
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeature(internship)}
                          className="rounded-full bg-[#0880EF] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#0A67C6]"
                        >
                          {internship.featured ? "Remove Feature" : "Promote"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-br from-[#0A67C6] to-[#0880EF] p-6 text-white shadow-lg shadow-blue-200">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">Featured Spotlight</p>
              <h3 className="mt-3 text-2xl font-semibold">
                {selectedInternship ? selectedInternship.title : "Choose a listing"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/85">
                {selectedInternship
                  ? `${selectedInternship.department} · ${selectedInternship.location} · Deadline ${formatDate(selectedInternship.deadline)}`
                  : "Use Spotlight from the queue to inspect a listing before promoting it."}
              </p>
              {selectedInternship ? (
                <button
                  type="button"
                  onClick={() => toggleFeature(selectedInternship)}
                  className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B5CC4] hover:bg-[#EEF5FF]"
                >
                  {selectedInternship.featured ? "Remove From Featured" : "Promote This Listing"}
                </button>
              ) : null}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Campaign Tools</h3>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={promoteNextDeadline}
                  className="rounded-xl border border-[#B9D9FF] bg-[#F2F8FF] px-4 py-3 text-left text-sm font-medium text-[#0B5CC4] hover:border-[#0880EF]"
                >
                  Promote Nearest Deadline
                </button>
                <button
                  type="button"
                  onClick={promoteNewestThree}
                  className="rounded-xl border border-[#B9D9FF] bg-[#F2F8FF] px-4 py-3 text-left text-sm font-medium text-[#0B5CC4] hover:border-[#0880EF]"
                >
                  Promote 3 Newest Listings
                </button>
                <button
                  type="button"
                  onClick={clearFeatured}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-medium text-rose-700 hover:border-rose-300"
                >
                  Clear All Featured Flags
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

type StatTileProps = {
  label: string;
  value: number | string;
};

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#FBFDFF] px-4 py-3 text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[#0B5CC4]">{value}</p>
    </div>
  );
}

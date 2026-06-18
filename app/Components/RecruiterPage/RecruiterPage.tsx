"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Internship,
  InternshipFormState,
  useRecruiterInternships,
} from "./useRecruiterInternships";
import EmptyListingsState from "./components/EmptyListingsState";
import InternshipListingCard from "./components/InternshipListingCard";
import RecruiterProfileCard from "./components/RecruiterProfileCard";
import RecruiterStatsGrid from "./components/RecruiterStatsGrid";

const internshipTypes: Internship["type"][] = ["Full-time", "Part-time", "Remote", "Hybrid"];

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

export default function RecruiterPage() {
  const {
    internships,
    stats,
    emptyForm,
    createListing,
    updateListing,
    promoteListing,
    closeListing,
    reopenListing,
  } = useRecruiterInternships();
  const [form, setForm] = useState<InternshipFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return internships;
    }

    return internships.filter((internship) => {
      return (
        internship.title.toLowerCase().includes(query) ||
        internship.department.toLowerCase().includes(query) ||
        internship.location.toLowerCase().includes(query) ||
        internship.status.toLowerCase().includes(query)
      );
    });
  }, [internships, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    resetForm();
    setShowCreateForm(false);
  };

  const handleLogout = () => {
    resetForm();
    setShowCreateForm(false);
    setSearch("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.department.trim() || !form.location.trim() || !form.deadline.trim() || !form.description.trim() || !form.stipend.trim()) {
      return;
    }

    if (editingId) {
      updateListing(editingId, form);
      resetForm();
      setShowCreateForm(false);
      return;
    }

    createListing(form);
    resetForm();
    setShowCreateForm(false);
  };

  const startEditing = (internship: Internship) => {
    setEditingId(internship.id);
    setForm({
      title: internship.title,
      department: internship.department,
      location: internship.location,
      type: internship.type,
      stipend: internship.stipend,
      deadline: internship.deadline,
      description: internship.description,
    });
    setShowCreateForm(true);
  };

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
                Recruiter Dashboard
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm xl:flex">
              <button
                type="button"
                className="rounded-full bg-[#E8F2FF] px-4 py-2 text-sm font-medium text-[#0B5CC4] shadow-sm"
                onClick={openCreateForm}
              >
                Create Internship
              </button>
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
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Featured Internship Promotion
              </Link>
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:px-8">
        <aside className="space-y-6">
          <RecruiterProfileCard
            name="Elena Rodriguez"
            role="Senior Tech Recruiter"
            stats={stats}
            onEditProfile={() => null}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Recruiter Tips</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Create a listing when you have the role details ready, then use the edit and feature controls to keep it current.
            </p>
          </section>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Recruiter Dashboard</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Manage internships with one focused workspace.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Create listings, publish them when ready, and control the full lifecycle from one page.
                </p>
              </div>

              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-[#0880EF] to-[#0A67C6] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-100 transition hover:translate-y-[-1px] hover:from-[#0A67C6] hover:to-[#0859AD]"
                onClick={openCreateForm}
              >
                + Create New Internship
              </button>
            </div>

            <RecruiterStatsGrid stats={stats} />
          </div>

          {showCreateForm && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Create Internship Listing</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">
                    {editingId ? "Update the internship details" : "Draft a new internship posting"}
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                  onClick={closeCreateForm}
                >
                  Close panel
                </button>
              </div>

              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Internship Title</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                    placeholder="Frontend Developer Intern"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                  <input
                    value={form.department}
                    onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                    placeholder="Remote or Bangalore"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Internship Type</label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as Internship["type"] }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  >
                    {internshipTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Stipend / Compensation</label>
                  <input
                    value={form.stipend}
                    onChange={(event) => setForm((current) => ({ ...current, stipend: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                    placeholder="$500/month"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Application Deadline</label>
                  <input
                    value={form.deadline}
                    onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
                    type="date"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                    placeholder="Describe the project, responsibilities, tools, and outcomes."
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0880EF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-[#0A67C6]"
                  >
                    {editingId ? "Save Changes" : "Publish Listing"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Internship Listings</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Your postings appear here</h3>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-[#0B5CC4]"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {filteredInternships.length === 0 ? (
                <EmptyListingsState />
              ) : (
                filteredInternships.map((internship) => (
                  <InternshipListingCard
                    key={internship.id}
                    internship={internship}
                    formatDate={formatDate}
                    onEdit={startEditing}
                    onFeature={promoteListing}
                    onClose={closeListing}
                    onReopen={reopenListing}
                  />
                ))
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl bg-gradient-to-br from-[#0A67C6] to-[#0880EF] p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Live Status
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              {internships.length === 0 ? "No active listings" : `${internships.filter((internship) => internship.status !== "Closed").length} live listings`}
            </h3>
            <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/75">Drafts in progress</p>
              <p className="mt-1 text-2xl font-semibold">{internships.filter((internship) => internship.status === "Draft").length}</p>
            </div>

            <button
              type="button"
              className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0B5CC4] transition hover:bg-[#F3F8FF]"
              onClick={resetForm}
            >
              Start New Draft
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recruiter Workflow</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Create a listing with the form and it appears in your dashboard.</li>
              <li>Edit any listing to update the posting before or after publishing.</li>
              <li>Close a listing when the role is filled or no longer accepting applications.</li>
              <li>Toggle Feature to promote priority internships.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}

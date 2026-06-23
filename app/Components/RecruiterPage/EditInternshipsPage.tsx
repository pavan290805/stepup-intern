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
import RecruiterStatsGrid from "./components/RecruiterStatsGrid";

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

type InternshipsPageMode = "edit" | "close" | "featured";

type EditInternshipsPageProps = {
  mode?: InternshipsPageMode;
};

const getPageCopy = (mode: InternshipsPageMode) => {
  if (mode === "close") {
    return {
      title: "Close Internships",
      subtitle: "Review and close open internship listings",
      helper: "Close mode: focus on listings that are currently open.",
      panelTitle: "Close Listing Panel",
      selectedTitle: "Select a listing to close or review",
    };
  }

  if (mode === "featured") {
    return {
      title: "Featured Promotion",
      subtitle: "Promote priority internship listings",
      helper: "Featured mode: featured listings are pinned to the top for quick promotion actions.",
      panelTitle: "Promotion Panel",
      selectedTitle: "Select a listing to feature or refine",
    };
  }

  return {
    title: "Edit Internships",
    subtitle: "Manage the current internship inventory",
    helper: "Edit mode: update listing details and keep your roles accurate.",
    panelTitle: "Editing Panel",
    selectedTitle: "Select a listing to begin",
  };
};

import Header from "./Header";

export default function EditInternshipsPage({ mode = "edit" }: EditInternshipsPageProps) {
  const {
    internships,
    stats,
    emptyForm,
    updateListing,
    promoteListing,
    closeListing,
    reopenListing,
  } = useRecruiterInternships();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<InternshipFormState>(emptyForm);

  const pageCopy = getPageCopy(mode);

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    const modeFilteredInternships = internships.filter((internship) => {
      if (mode === "close") {
        return internship.status !== "Closed";
      }

      if (mode === "featured") {
        return internship.status !== "Closed";
      }

      return true;
    });

    const orderedInternships =
      mode === "featured"
        ? [
            ...modeFilteredInternships.filter((internship) => internship.featured),
            ...modeFilteredInternships.filter((internship) => !internship.featured),
          ]
        : modeFilteredInternships;

    if (!query) {
      return orderedInternships;
    }

    return orderedInternships.filter((internship) => {
      return (
        internship.title.toLowerCase().includes(query) ||
        internship.department.toLowerCase().includes(query) ||
        internship.location.toLowerCase().includes(query) ||
        internship.status.toLowerCase().includes(query)
      );
    });
  }, [internships, search, mode]);

  const selectedInternship = internships.find((internship) => internship.id === selectedId) ?? null;

  const startEditing = (internship: Internship) => {
    setSelectedId(internship.id);
    setForm({
      title: internship.title,
      department: internship.department,
      location: internship.location,
      type: internship.type,
      stipend: internship.stipend,
      deadline: internship.deadline,
      description: internship.description,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedId) {
      return;
    }

    updateListing(selectedId, form);
  };

  const hasListings = internships.length > 0;

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <Header />

      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 xl:grid-cols-[260px_minmax(0,1fr)_340px] xl:px-12">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{pageCopy.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Review current internship posts, pick one to edit, and update its details without leaving the page.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Quick Stats</h3>
            <RecruiterStatsGrid stats={stats} compact />
          </section>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{pageCopy.title}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {pageCopy.subtitle}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{pageCopy.helper}</p>
              </div>

              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                Search
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-48 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Title or department"
                />
              </label>
            </div>
          </div>

          {!hasListings ? (
            <EmptyListingsState />
          ) : filteredInternships.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C9DDF8] bg-[linear-gradient(180deg,#f7fbff,#eef5ff)] px-6 py-14 text-center shadow-sm">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-2xl text-[#0880EF] shadow-md">
                ✦
              </div>
              <h4 className="text-xl font-semibold text-slate-900">No matching internship listings</h4>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Try a different search term or go back to the dashboard to create a new listing first.
              </p>
            </div>
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
        </section>

        <aside className="space-y-6 lg:col-span-2 xl:col-span-1">
          <section className="rounded-2xl bg-gradient-to-br from-[#0A67C6] to-[#0880EF] p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              {pageCopy.panelTitle}
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              {selectedInternship ? `Editing ${selectedInternship.title}` : pageCopy.selectedTitle}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Update role details, fix copy, or keep the listing aligned with your hiring plan.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {selectedInternship ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                  <input
                    value={form.department}
                    onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Stipend</label>
                  <input
                    value={form.stipend}
                    onChange={(event) => setForm((current) => ({ ...current, stipend: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Deadline</label>
                  <input
                    value={form.deadline}
                    onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
                    type="date"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0880EF] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Deselect
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <h4 className="text-lg font-semibold text-slate-900">No listing selected</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Choose an internship from the list to load its fields here for editing.
                </p>
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Internship,
  InternshipFormState,
  useRecruiterInternships,
} from "./useRecruiterInternships";
import { useRecruiterProfile } from "./useRecruiterProfile";
import { useApplicants } from "./useApplicants";
import EmptyListingsState from "./components/EmptyListingsState";
import InternshipListingCard from "./components/InternshipListingCard";
import RecruiterStatsGrid from "./components/RecruiterStatsGrid";
import Header from "./Header";
import InternshipApplicantsPage from "./components/InternshipApplicantsPage";

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
    emptyForm,
    createListing,
    updateListing,
    promoteListing,
    closeListing,
    reopenListing,
    removeListing,
  } = useRecruiterInternships();
  const { profile } = useRecruiterProfile();
  const { applicants } = useApplicants();
  const [form, setForm] = useState<InternshipFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingApplicants, setViewingApplicants] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const open = window.localStorage.getItem("open_manage_internships");
      if (open === "true") {
        setShowCreateForm(true);
        window.localStorage.removeItem("open_manage_internships");
      }
    }
  }, []);
  const [errors, setErrors] = useState<Record<keyof InternshipFormState, string>>({
    title: "",
    department: "",
    location: "",
    type: "",
    stipend: "",
    deadline: "",
    description: "",
  });

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
    setErrors({
      title: "",
      department: "",
      location: "",
      type: "",
      stipend: "",
      deadline: "",
      description: "",
    });
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    resetForm();
    setShowCreateForm(false);
  };

  const updateField = <K extends keyof InternshipFormState>(field: K, value: InternshipFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleLogout = () => {
    resetForm();
    setShowCreateForm(false);
    setSearch("");
  };

  const dashboardStats = useMemo(() => {
    const totalListings = internships.length;
    const activeInternships = internships.filter(
      (listing) => listing.status === "Active" || listing.status === "Promoted",
    );
    const activeListings = activeInternships.length;
    
    // Count applicants for active internships
    const activeInternshipIds = new Set(activeInternships.map((i) => i.id));
    const studentsApplied = applicants.filter((applicant: any) =>
      activeInternshipIds.has(applicant.internshipId),
    ).length;

    return [
      { label: "Total Listings", value: totalListings },
      { label: "Active Listings", value: activeListings },
      { label: "Students Applied", value: studentsApplied },
    ];
  }, [internships, applicants]);

  const validateForm = () => {
    const nextErrors: Record<keyof InternshipFormState, string> = {
      title: "",
      department: "",
      location: "",
      type: "",
      stipend: "",
      deadline: "",
      description: "",
    };

    if (!form.title.trim()) {
      nextErrors.title = "Internship title is required.";
    }
    if (!form.department.trim()) {
      nextErrors.department = "Department is required.";
    }
    if (!form.location.trim()) {
      nextErrors.location = "Location is required.";
    }
    if (!form.stipend.trim()) {
      nextErrors.stipend = "Stipend / compensation is required.";
    }
    if (!form.deadline.trim()) {
      nextErrors.deadline = "Application deadline is required.";
    }
    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
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

  const handleViewApplicants = (internship: Internship) => {
    setSelectedInternship(internship);
    setViewingApplicants(true);
  };

  const handleBackFromApplicants = () => {
    setViewingApplicants(false);
    setSelectedInternship(null);
  };

  return (
    <>
      {viewingApplicants && selectedInternship ? (
        <InternshipApplicantsPage
          internship={selectedInternship}
          onBack={handleBackFromApplicants}
        />
      ) : (
        <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <Header onCreate={openCreateForm} />

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
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

            <RecruiterStatsGrid stats={dashboardStats} />
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
                    onChange={(event) => updateField("title", event.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                    placeholder="Frontend Developer Intern"
                  />
                  {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                  <input
                    value={form.department}
                    onChange={(event) => updateField("department", event.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.department ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                    placeholder="Engineering"
                  />
                  {errors.department ? <p className="mt-2 text-sm text-red-600">{errors.department}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.location ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                    placeholder="Remote or Bangalore"
                  />
                  {errors.location ? <p className="mt-2 text-sm text-red-600">{errors.location}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Internship Type</label>
                  <select
                    value={form.type}
                    onChange={(event) => updateField("type", event.target.value as Internship["type"])}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.type ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                  >
                    {internshipTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type ? <p className="mt-2 text-sm text-red-600">{errors.type}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Stipend / Compensation</label>
                  <input
                    value={form.stipend}
                    onChange={(event) => updateField("stipend", event.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.stipend ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                    placeholder="$500/month"
                  />
                  {errors.stipend ? <p className="mt-2 text-sm text-red-600">{errors.stipend}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Application Deadline</label>
                  <input
                    value={form.deadline}
                    onChange={(event) => updateField("deadline", event.target.value)}
                    type="date"
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#0880EF]/15 ${errors.deadline ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                  />
                  {errors.deadline ? <p className="mt-2 text-sm text-red-600">{errors.deadline}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    rows={5}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15 ${errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300 bg-white"}`}
                    placeholder="Describe the project, responsibilities, tools, and outcomes."
                  />
                  {errors.description ? (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  ) : null}
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Internship Listings</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Your postings appear here</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="text-sm font-medium text-[#0B5CC4]"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              </div>
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
                    onViewApplicants={handleViewApplicants}
                    onDelete={(id) => {
                      if (window.confirm("Remove this internship listing?")) {
                        removeListing(id);
                      }
                    }}
                  />
                ))
              )}
            </div>
          </section>
        </section>
      </main>
        </div>
      )}
    </>
  );
}

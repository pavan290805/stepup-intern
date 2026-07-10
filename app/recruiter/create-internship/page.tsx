"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import { apiFetch } from "@/lib/api";

const steps = [
  { id: 1, label: "Role Info" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "Stipend & Perks" },
  { id: 4, label: "Visibility" },
];

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
  "Product",
  "Data Science",
];

type WorkMode = "Remote" | "On-site" | "Hybrid";
type PublishStatus = "draft" | "active";

export default function CreateInternshipPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [description, setDescription] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [duration, setDuration] = useState("3 Months");
  const [openings, setOpenings] = useState("1");
  const [stipend, setStipend] = useState("10000");
  const [deadline, setDeadline] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const skillsRequired = useMemo(
    () =>
      skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [skillsText]
  );

  const previewTitle = title || "Internship Title";
  const previewLocation = location || department;

  const stepLabel =
    currentStep === 1
      ? "General Information"
      : currentStep === 2
        ? "Role Requirements"
        : currentStep === 3
          ? "Stipend & Perks"
          : "Visibility & Launch";

  const validateStep = () => {
    if (currentStep === 1) {
      if (title.trim().length < 5) {
        return "Title must be at least 5 characters.";
      }

      if (description.trim().length < 20) {
        return "Description must be at least 20 characters.";
      }
    }

    if (currentStep === 2) {
      if (!location.trim()) {
        return "Location is required.";
      }

      if (!skillsRequired.length) {
        return "Add at least one required skill, separated by commas.";
      }

      if (!duration.trim()) {
        return "Duration is required.";
      }
    }

    if (currentStep === 3) {
      if (Number.isNaN(Number(stipend)) || Number(stipend) < 0) {
        return "Stipend must be a valid number.";
      }

      if (Number.isNaN(Number(openings)) || Number(openings) < 1) {
        return "Openings must be at least 1.";
      }
    }

    if (currentStep === 4 && !deadline) {
      return "Deadline is required.";
    }

    return "";
  };

  const handleNext = async () => {
    setError("");

    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep((step) => Math.min(step + 1, steps.length));
      return;
    }

    setSubmitting(true);

    try {
      console.log("Creating internship...");
      const response = await apiFetch("/internships", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skillsRequired,
          location: location.trim() || department,
          workMode: workMode === "On-site" ? "onsite" : workMode.toLowerCase(),
          stipend: Number(stipend) || 0,
          duration: duration.trim(),
          openings: Number(openings) || 1,
          deadline: new Date(deadline).toISOString(),
          featured,
          status,
        }),
      });

      const internshipId = response?.data?._id || response?.data?.id;
      router.push(internshipId ? `/recruiter/internships/${internshipId}` : "/recruiter");
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to create internship. Please check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Internship</h1>
          <p className="text-sm mt-2 text-gray-500">
            Fill in the details below to launch your next talent search. <span className="text-blue-600">High-quality descriptions</span> attract better candidates.
          </p>
        </div>

        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    step.id === currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : step.id < currentStep
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium ${
                    step.id === currentStep
                      ? "text-blue-600"
                      : step.id < currentStep
                        ? "text-blue-500"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className={`w-24 h-0.5 mb-4 mx-1 ${step.id < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-7">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{stepLabel}</h2>
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Internship Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Product Design Intern"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                      >
                        {departments.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Work Mode
                    </label>
                    <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                      {(["Remote", "On-site", "Hybrid"] as WorkMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setWorkMode(mode)}
                          className={`flex-1 py-3 text-sm font-medium transition ${
                            workMode === mode
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Description
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
                      {[
                        <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>,
                        <svg key="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>,
                        <svg key="ul" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></svg>,
                        <svg key="link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
                      ].map((icon, i) => (
                        <button key={i} type="button" className="p-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition">
                          {icon}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Describe the day-to-day responsibilities..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, India"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Required Skills
                  </label>
                  <textarea
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-400">Separate skills with commas.</p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 Months"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="w-40">
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Openings
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Monthly Stipend
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      placeholder="10000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                      Perks Note
                    </label>
                    <div className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 bg-gray-50">
                      Add perks and mentorship details in the description.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Role Summary
                  </label>
                  <div className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 bg-gray-50">
                    {workMode} • {duration} • {Number(stipend).toLocaleString()} stipend
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Feature this internship</p>
                    <p className="text-xs text-gray-500 mt-1">Highlighted roles get more visibility on the dashboard.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatured((value) => !value)}
                    className={`relative w-14 h-8 rounded-full transition ${featured ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition ${featured ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                    Publish Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "draft", label: "Save as Draft" },
                      { value: "active", label: "Publish Now" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setStatus(option.value as PublishStatus)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          status === option.value
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1 || submitting}
                className="px-5 py-3 rounded-xl font-medium text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-70"
              >
                {submitting
                  ? "Publishing..."
                  : currentStep < steps.length
                    ? `Next: ${steps[currentStep].label} →`
                    : status === "active"
                      ? "Publish Internship →"
                      : "Save Draft →"}
              </button>
            </div>
          </div>

          <div className="w-64 shrink-0 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-blue-600 h-20 flex items-center justify-center">
                <span className="text-white text-sm opacity-70">Preview</span>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 text-sm leading-tight">{previewTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">TechCorp Inc.</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {previewLocation}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    {workMode}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    {duration}
                  </div>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {deadline ? new Date(deadline).toLocaleDateString([], { day: "numeric", month: "short" }) : "30 Days"}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
                    {status === "active" ? "Live" : "Draft"}
                  </span>
                  {featured && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Pro Tip</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Detailed descriptions get <span className="text-white font-semibold">40% more</span> qualified applicants. Be clear about the tech stack and the mentorship available.
              </p>
              <button type="button" className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-medium">
                Read Guide →
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">Creation Status</p>
              <div className="space-y-2.5">
                {[
                  { label: "Role Information", done: currentStep > 1 || title.trim().length > 0 },
                  { label: "Experience & Skills", done: currentStep > 2 || skillsRequired.length > 0 },
                  { label: "Compensation Details", done: currentStep > 3 || Number(stipend) > 0 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    {item.done ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? "text-green-600 font-medium" : "text-gray-400"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../Components/Navbar";

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

export default function CreateInternshipPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [description, setDescription] = useState("");

  const previewTitle = title || "Internship Title";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Internship
          </h1>
          <p className="text-sm mt-2 text-gray-500">
            Fill in the details below to launch your next talent search.{" "}
            <span className="text-blue-600">High-quality descriptions</span>{" "}
            attract better candidates.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
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

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mb-4 mx-1 ${
                    step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main layout: form + sidebar */}
        <div className="flex gap-6 items-start">
          {/* Form card */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-7">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              General Information
            </h2>

            {/* Internship Title */}
            <div className="mb-5">
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

            {/* Department + Work Mode */}
            <div className="flex gap-4 mb-5">
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
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                  Work Mode
                </label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  {(["Remote", "On-site", "Hybrid"] as WorkMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setWorkMode(m)}
                      className={`flex-1 py-3 text-sm font-medium transition ${
                        workMode === m
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                Description
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
                  {[
                    // Bold
                    <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
                    // Italic
                    <svg key="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
                    // List
                    <svg key="ul" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>,
                    // Link
                    <svg key="link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
                  ].map((icon, i) => (
                    <button
                      key={i}
                      className="p-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                    >
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

            {/* Next button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep((s) => Math.min(s + 1, 4))}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition"
              >
                Next: Requirements →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-64 shrink-0 space-y-4">
            {/* Preview card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Blue preview header */}
              <div className="bg-blue-600 h-20 flex items-center justify-center">
                <span className="text-white text-sm opacity-70">Preview</span>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 text-sm leading-tight">
                      {previewTitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">TechCorp Inc.</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {workMode}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Paid
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    30 Days
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
                    New Posting
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gray-900 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Detailed descriptions get{" "}
                <span className="text-white font-semibold">40% more</span>{" "}
                qualified applicants. Be clear about the tech stack and the
                mentorship available.
              </p>
              <button className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-medium">
                Read Guide →
              </button>
            </div>

            {/* Creation Status */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
                Creation Status
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Role Information", done: true },
                  { label: "Experience & Skills", done: false },
                  { label: "Compensation Details", done: false },
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
                    <span
                      className={`text-xs ${
                        item.done
                          ? "text-green-600 font-medium"
                          : "text-gray-400"
                      }`}
                    >
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
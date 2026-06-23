"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { useRecruiterProfile } from "./useRecruiterProfile";
import { useRecruiterInternships } from "./useRecruiterInternships";
import { useApplicants } from "./useApplicants";
import RecruiterProfileCard from "./components/RecruiterProfileCard";

export type ProfileFormState = {
  name: string;
  picture: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  headquarters: string;
  about: string;
  teamSize: number;
  openRoles: number;
  activeListings: number;
  candidatePipeline: number;
  placements: number;
  applicantAlerts: boolean;
  interviewSummaries: boolean;
  marketingDigests: boolean;
  twoFactorEnabled: boolean;
  keyExpertise: string[];
  experienceHistory: Array<{ title: string; company: string; period: string }>;
};

export default function ProfilePage() {
  const { profile, updateProfile } = useRecruiterProfile();
  const { internships } = useRecruiterInternships();
  const { applicants } = useApplicants();
  const [form, setForm] = useState<ProfileFormState>({
    name: profile.name,
    picture: profile.picture,
    role: profile.role,
    company: profile.company,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    website: profile.website,
    industry: profile.industry,
    headquarters: profile.headquarters,
    about: profile.about,
    teamSize: profile.teamSize,
    openRoles: profile.openRoles,
    activeListings: profile.activeListings,
    candidatePipeline: profile.candidatePipeline,
    placements: profile.placements,
    applicantAlerts: profile.applicantAlerts,
    interviewSummaries: profile.interviewSummaries,
    marketingDigests: profile.marketingDigests,
    twoFactorEnabled: profile.twoFactorEnabled,
    keyExpertise: profile.keyExpertise,
    experienceHistory: profile.experienceHistory,
  });
  const [personalEditing, setPersonalEditing] = useState(false);
  const [companyEditing, setCompanyEditing] = useState(false);
  const [backgroundEditing, setBackgroundEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [picturePreview, setPicturePreview] = useState<string>(profile.picture);

  useEffect(() => {
    setForm({
      name: profile.name,
      picture: profile.picture,
      role: profile.role,
      company: profile.company,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      industry: profile.industry,
      headquarters: profile.headquarters,
      about: profile.about,
      teamSize: profile.teamSize,
      openRoles: profile.openRoles,
      activeListings: profile.activeListings,
      candidatePipeline: profile.candidatePipeline,
      placements: profile.placements,
      applicantAlerts: profile.applicantAlerts,
      interviewSummaries: profile.interviewSummaries,
      marketingDigests: profile.marketingDigests,
      twoFactorEnabled: profile.twoFactorEnabled,
      keyExpertise: profile.keyExpertise,
      experienceHistory: profile.experienceHistory,
    });
    setPicturePreview(profile.picture);
  }, [profile]);

  const activeInternships = useMemo(
    () => internships.filter((internship) => internship.status === "Active" || internship.status === "Promoted"),
    [internships],
  );

  const pipelineCount = useMemo(
    () => applicants.filter((applicant) => applicant.status !== "Rejected").length,
    [applicants],
  );

  const placementsCount = useMemo(
    () => applicants.filter((applicant) => applicant.status === "Completed").length,
    [applicants],
  );

  const stats = useMemo(
    () => [
      { label: "Team size", value: profile.teamSize },
      { label: "Open roles", value: activeInternships.length },
      { label: "Active listings", value: activeInternships.length },
      { label: "Pipeline", value: pipelineCount },
    ],
    [profile.teamSize, activeInternships.length, pipelineCount],
  );

  const snapshot = useMemo(
    () => [
      { label: "Open roles", value: activeInternships.length },
      { label: "Candidate pipeline", value: pipelineCount },
      { label: "Active listings", value: activeInternships.length },
      { label: "Placements", value: placementsCount },
    ],
    [activeInternships.length, pipelineCount, placementsCount],
  );

  const displayedProfile = profile;

  const updateField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    updateProfile({
      ...profile,
      ...form,
    });
    setSavedMessage("Profile updated successfully.");
    setPersonalEditing(false);
    setCompanyEditing(false);
    setBackgroundEditing(false);
    window.setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: profile.name,
      picture: profile.picture,
      role: profile.role,
      company: profile.company,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      industry: profile.industry,
      headquarters: profile.headquarters,
      about: profile.about,
      teamSize: profile.teamSize,
      openRoles: profile.openRoles,
      activeListings: profile.activeListings,
      candidatePipeline: profile.candidatePipeline,
      placements: profile.placements,
      applicantAlerts: profile.applicantAlerts,
      interviewSummaries: profile.interviewSummaries,
      marketingDigests: profile.marketingDigests,
      twoFactorEnabled: profile.twoFactorEnabled,
      keyExpertise: profile.keyExpertise,
      experienceHistory: profile.experienceHistory,
    });
    setPicturePreview(profile.picture);
    setPersonalEditing(false);
    setCompanyEditing(false);
    setBackgroundEditing(false);
  };

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextPicture = String(reader.result ?? "");
      setForm((current) => ({ ...current, picture: nextPicture }));
      setPicturePreview(nextPicture);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <Header />

      <main className="mx-auto grid w-full max-w-none gap-10 px-4 pt-6 pb-28 sm:px-6 lg:grid-cols-[420px_minmax(0,2.1fr)] lg:px-12 xl:px-16">
        <aside className="space-y-6">
          <RecruiterProfileCard
            name={displayedProfile.name}
            picture={displayedProfile.picture}
            role={displayedProfile.role}
            company={displayedProfile.company}
            location={displayedProfile.location}
            stats={stats}
            onEditProfile={() => {
              setPersonalEditing(true);
              setCompanyEditing(false);
            }}
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Personal Details</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Contact & location</h2>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPersonalEditing(true);
                  setCompanyEditing(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#0880EF] hover:text-[#0880EF]"
                aria-label="Edit personal details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" />
                  <path fillRule="evenodd" d="M2 16.25A2.25 2.25 0 0 1 4.25 14H5v1.25A2.25 2.25 0 0 1 2.75 17.5H2v-1.25z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Email address</p>
                {personalEditing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.email}</p>
                )}
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Phone number</p>
                {personalEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.phone}</p>
                )}
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Location</p>
                {personalEditing ? (
                  <input
                    type="text"
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.location}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Company Hub</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Brand and employer details</h2>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCompanyEditing(true);
                  setPersonalEditing(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#0880EF] hover:text-[#0880EF]"

                aria-label="Edit company details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" />
                  <path fillRule="evenodd" d="M2 16.25A2.25 2.25 0 0 1 4.25 14H5v1.25A2.25 2.25 0 0 1 2.75 17.5H2v-1.25z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Company name</p>
                {companyEditing ? (
                  <input
                    type="text"
                    value={form.company}
                    onChange={(event) => updateField("company", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.company}</p>
                )}
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 min-w-0">
                <p className="text-sm text-slate-500">Website URL</p>
                {companyEditing ? (
                  <input
                    type="text"
                    value={form.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 break-words font-medium text-slate-900">{displayedProfile.website}</p>
                )}
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 min-w-0">
                <p className="text-sm text-slate-500">Industry</p>
                {companyEditing ? (
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(event) => updateField("industry", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.industry}</p>
                )}
              </div>
              <div className="sm:col-span-2 rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Headquarters</p>
                {companyEditing ? (
                  <input
                    type="text"
                    value={form.headquarters}
                    onChange={(event) => updateField("headquarters", event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                  />
                ) : (
                  <p className="mt-1 font-medium text-slate-900">{displayedProfile.headquarters}</p>
                )}
              </div>
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Profile management</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Your recruiter identity</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {savedMessage ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800">
                    {savedMessage}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Professional Background</h3>
                      <p className="mt-2 text-sm text-slate-600">A hiring summary and experience overview that represents your recruiter profile.</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBackgroundEditing(true);
                        setPersonalEditing(false);
                        setCompanyEditing(false);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#0880EF] hover:text-[#0880EF]"
                      aria-label="Edit professional background"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                        <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" />
                        <path fillRule="evenodd" d="M2 16.25A2.25 2.25 0 0 1 4.25 14H5v1.25A2.25 2.25 0 0 1 2.75 17.5H2v-1.25z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Professional bio</p>
                      {backgroundEditing ? (
                        <textarea
                          value={form.about}
                          onChange={(event) => updateField("about", event.target.value)}
                          className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                          rows={5}
                        />
                      ) : (
                        <p className="mt-3 text-sm leading-7 text-slate-700">{profile.about}</p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-500">Key expertise</p>
                          {backgroundEditing ? (
                            <button
                              type="button"
                              onClick={() => updateField("keyExpertise", [...form.keyExpertise, ""])}
                              className="text-sm font-semibold text-[#0880EF] hover:text-[#0960c1]"
                            >
                              + Add
                            </button>
                          ) : null}
                        </div>
                        <ul className="mt-4 space-y-3 text-sm text-slate-700">
                          {backgroundEditing ? (
                            form.keyExpertise.map((item, index) => (
                              <li key={`${item}-${index}`} className="flex items-center gap-2">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E8F2FF] text-xs text-[#0B5CC4]">✓</span>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(event) => {
                                    const next = [...form.keyExpertise];
                                    next[index] = event.target.value;
                                    updateField("keyExpertise", next);
                                  }}
                                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                                />
                              </li>
                            ))
                          ) : (
                            profile.keyExpertise.map((item) => (
                              <li key={item} className="flex items-center gap-2">
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E8F2FF] text-xs text-[#0B5CC4]">✓</span>
                                {item}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-500">Experience history</p>
                          {backgroundEditing ? (
                            <button
                              type="button"
                              onClick={() => updateField("experienceHistory", [...form.experienceHistory, { title: "", company: "", period: "" }])}
                              className="text-sm font-semibold text-[#0880EF] hover:text-[#0960c1]"
                            >
                              + Add
                            </button>
                          ) : null}
                        </div>
                        <div className="mt-4 space-y-4 text-sm text-slate-700">
                          {backgroundEditing ? (
                            form.experienceHistory.map((entry, index) => (
                              <div key={`${entry.title}-${entry.company}-${index}`} className="space-y-2 rounded-2xl bg-slate-50 p-3">
                                <input
                                  type="text"
                                  value={entry.title}
                                  onChange={(event) => {
                                    const next = [...form.experienceHistory];
                                    next[index] = { ...next[index], title: event.target.value };
                                    updateField("experienceHistory", next);
                                  }}
                                  placeholder="Role title"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                                />
                                <input
                                  type="text"
                                  value={entry.company}
                                  onChange={(event) => {
                                    const next = [...form.experienceHistory];
                                    next[index] = { ...next[index], company: event.target.value };
                                    updateField("experienceHistory", next);
                                  }}
                                  placeholder="Company"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                                />
                                <input
                                  type="text"
                                  value={entry.period}
                                  onChange={(event) => {
                                    const next = [...form.experienceHistory];
                                    next[index] = { ...next[index], period: event.target.value };
                                    updateField("experienceHistory", next);
                                  }}
                                  placeholder="Period"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/15"
                                />
                              </div>
                            ))
                          ) : (
                            profile.experienceHistory.map((entry) => (
                              <div key={`${entry.title}-${entry.company}`}>
                                <p className="font-semibold text-slate-900">{entry.title}</p>
                                <p className="text-slate-600">{entry.company}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{entry.period}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Account & Security Hub</h3>
                      <p className="mt-2 text-sm text-slate-600">Control recruiter notifications and security preferences.</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <label className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-900">Applicant Alerts</p>
                        <p className="text-sm text-slate-500">Get notified when new applicants arrive.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.applicantAlerts}
                        onChange={(event) => updateField("applicantAlerts", event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#0B5CC4] focus:ring-[#0B5CC4]"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-900">Interview Summaries</p>
                        <p className="text-sm text-slate-500">Receive summaries after each interview.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.interviewSummaries}
                        onChange={(event) => updateField("interviewSummaries", event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#0B5CC4] focus:ring-[#0B5CC4]"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-900">Marketing Digests</p>
                        <p className="text-sm text-slate-500">Receive product and hiring insights.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.marketingDigests}
                        onChange={(event) => updateField("marketingDigests", event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#0B5CC4] focus:ring-[#0B5CC4]"
                      />
                    </label>
                  </div>

                  <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">Security control</p>
                        <p className="text-sm text-slate-500">Two-factor authentication and audit status.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField("twoFactorEnabled", !form.twoFactorEnabled)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {form.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        Change Password
                      </button>
                      <div className="rounded-2xl bg-[#F8F6FF] p-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">Security status</p>
                        <p className="mt-2">{profile.twoFactorEnabled ? "2FA enabled" : "2FA disabled"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl bg-[#FEF3F2] p-4 text-sm text-slate-700">
                    <p className="font-semibold text-rose-700">For your protection</p>
                    <p className="mt-2">{profile.lastAudit}</p>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-[#F8FAFF] p-5">
                  <h3 className="text-base font-semibold text-slate-900">Profile snapshot</h3>
                  <div className="mt-4 grid gap-4">
                    {snapshot.map((item) => (
                      <div key={item.label} className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-[#0B5CC4]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">Employer reach</h3>
                  <p className="mt-3 text-sm text-slate-600">Stay connected with hiring managers and early-career programs across your networks.</p>
                </div>
              </aside>
            </div>
          </div>

          {(personalEditing || companyEditing || backgroundEditing) ? (
            <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[1800px] bg-transparent px-4 pb-4 sm:px-6 lg:px-12 xl:px-16">
              <div className="mx-auto flex max-w-6xl flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/20 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  {personalEditing ? "Editing personal details." : companyEditing ? "Editing company details." : "Editing professional background."} Use the buttons below to save changes or restore current values.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Restore values
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-2xl bg-[#0880EF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A67C6]"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

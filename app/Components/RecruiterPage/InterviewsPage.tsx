"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RecruiterProfileCard from "./components/RecruiterProfileCard";
import Header from "./Header";

type Invitation = {
  id: string;
  company: string;
  role: string;
  date?: string;
  status: "Pending" | "Selected" | "Completed";
};

export default function InterviewsPage() {
  const [link, setLink] = useState<string>("");
  const [savedLink, setSavedLink] = useState<string>("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  // start with no recent alerts for now
  const [alerts, setAlerts] = useState<Array<{ id: string; title: string; time: string; avatar?: string }>>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("recruiter_calendly_link") : null;
    if (stored) setSavedLink(stored);

    setInvitations([
      { id: "1", company: "TechNova Solutions", role: "Frontend Intern", date: "2023-10-12T10:30", status: "Pending" },
      { id: "2", company: "Creatix Studio", role: "UI/UX Design Intern", date: "2023-10-05T09:00", status: "Selected" },
    ]);
  }, []);

  const saveLink = () => {
    try {
      localStorage.setItem("recruiter_calendly_link", link.trim());
      setSavedLink(link.trim());
    } catch (e) {
      // ignore
    }
  };

  const openScheduler = (invite: Invitation) => {
    const url = savedLink || link;
    if (!url) return;
    window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <Header />

      <main className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">
        <aside className="space-y-6">
          <RecruiterProfileCard
            name="Elena Rodriguez"
            role="Senior Tech Recruiter"
            stats={[
              { label: "Total Listings", value: 0 },
              { label: "Active Listings", value: 0 },
              { label: "Featured Listings", value: 0 },
              { label: "Closed Listings", value: 0 },
            ]}
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
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Scheduling Configuration</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Configure your calendar</h2>
                <p className="mt-2 text-sm text-slate-600">Centralize your interview booking experience.</p>
              </div>
              <div className="flex items-center gap-3">
                {savedLink ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">LINK ACTIVE</span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste your Calendly or Doodle link"
                className="col-span-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#0880EF]"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLink(savedLink)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={saveLink}
                  className="rounded-xl bg-[#0880EF] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Interview Invitations</h3>
            <p className="mt-1 text-sm text-slate-600">Manage and schedule candidate meetings.</p>

            <div className="mt-6 space-y-4">
              {invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{inv.company}</p>
                    <p className="text-sm text-slate-600">{inv.role}</p>
                    <p className="mt-1 text-xs text-slate-500">{inv.date ? new Date(inv.date).toLocaleString() : "TBD"}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {inv.status === "Pending" ? (
                      <button
                        onClick={() => openScheduler(inv)}
                        className="rounded-xl bg-[#0B5CC4] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Schedule Interview
                      </button>
                    ) : (
                      <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">View Feedback</button>
                    )}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Alerts</h3>
              <div className="flex items-center gap-2">
                {alerts.length > 0 && (
                  <button
                    onClick={() => setAlerts([])}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {alerts.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">No recent alerts</div>
              ) : (
                alerts.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-start gap-3">
                      {a.avatar ? (
                        <img src={a.avatar} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-slate-100" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{a.title}</p>
                        <p className="text-xs text-slate-500">{a.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">View All Activity</button>
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-[#0A67C6] to-[#0880EF] p-6 text-white shadow-lg shadow-blue-200">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Hiring Progress</p>
            <h3 className="mt-3 text-2xl font-semibold">84%</h3>
            <p className="mt-2 text-sm text-white/85">You have completed 12 out of 15 interviews scheduled for this week.</p>
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

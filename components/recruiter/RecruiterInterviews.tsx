"use client";

import { useMemo, useState } from "react";
import Header from "../layout/Header";

type InterviewStatus = "Scheduled" | "Completed" | "Cancelled";

type InterviewCard = {
  id: string;
  company: string;
  role: string;
  dateLabel: string;
  status: InterviewStatus;
  feedback?: string;
  mode: string;
  meetingLink?: string;
};
const initialInterviews: InterviewCard[] = [
  {
    id: "1",
    company: "Frontend Developer",
    role: "Rahul Kumar",
    dateLabel: "15 Aug 2026, 10:00 AM",
    status: "Scheduled",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/",
  },
  {
    id: "2",
    company: "Backend Developer",
    role: "Priya Sharma",
    dateLabel: "16 Aug 2026, 2:00 PM",
    status: "Completed",
    mode: "Google Meet",
    feedback:
      "Candidate demonstrated good backend fundamentals and problem-solving skills.",
  },
  {
    id: "3",
    company: "Data Analyst",
    role: "Arjun Reddy",
    dateLabel: "18 Aug 2026, 11:00 AM",
    status: "Scheduled",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/",
  },
  {
    id: "4",
    company: "Python Developer",
    role: "Sneha Reddy",
    dateLabel: "19 Aug 2026, 3:30 PM",
    status: "Scheduled",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/",
  },
  {
    id: "5",
    company: "UI/UX Designer",
    role: "Vikram Singh",
    dateLabel: "20 Aug 2026, 11:30 AM",
    status: "Completed",
    mode: "Google Meet",
    feedback:
      "Strong design skills and good understanding of user experience principles.",
  },
  {
    id: "6",
    company: "Machine Learning Intern",
    role: "Ananya Rao",
    dateLabel: "21 Aug 2026, 4:00 PM",
    status: "Scheduled",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/",
  },
  {
    id: "7",
    company: "Cloud Engineer",
    role: "Karthik Reddy",
    dateLabel: "22 Aug 2026, 10:30 AM",
    status: "Cancelled",
    mode: "Google Meet",
  },
];

const activities = [
  "Rahul Kumar interview is scheduled.",
  "Priya Sharma interview was completed.",
  "Arjun Reddy interview is scheduled.",
];

export default function InterviewsPage() {
  const [interviews, setInterviews] =
    useState<InterviewCard[]>(initialInterviews);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | InterviewStatus>("All");

  const [selectedInterview, setSelectedInterview] =
    useState<InterviewCard | null>(null);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const summary = useMemo(() => {
    return {
      total: interviews.length,
      scheduled: interviews.filter(
        (item) => item.status === "Scheduled"
      ).length,
      completed: interviews.filter(
        (item) => item.status === "Completed"
      ).length,
      cancelled: interviews.filter(
        (item) => item.status === "Cancelled"
      ).length,
    };
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch =
        interview.role.toLowerCase().includes(search.toLowerCase()) ||
        interview.company.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || interview.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [interviews, search, filter]);

  const progress =
    summary.total > 0
      ? Math.round((summary.completed / summary.total) * 100)
      : 0;

  const openScheduleModal = (interview: InterviewCard) => {
    setSelectedInterview(interview);
    setSelectedDate("");
    setSelectedTime("");
    setShowScheduleModal(true);
  };

  const saveSchedule = () => {
    if (!selectedInterview || !selectedDate || !selectedTime) {
      return;
    }

    const formattedDate = new Date(
      `${selectedDate}T${selectedTime}`
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setInterviews((current) =>
      current.map((interview) =>
        interview.id === selectedInterview.id
          ? {
              ...interview,
              dateLabel: formattedDate,
              status: "Scheduled",
              mode: "Google Meet",
              meetingLink: "https://meet.google.com/",
            }
          : interview
      )
    );

    setShowScheduleModal(false);
    setSelectedInterview(null);
  };

  const openDetails = (interview: InterviewCard) => {
    setSelectedInterview(interview);
  };

  const openFeedback = (interview: InterviewCard) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  const openCancelModal = (interview: InterviewCard) => {
    setSelectedInterview(interview);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!selectedInterview) return;

    setInterviews((current) =>
      current.map((interview) =>
        interview.id === selectedInterview.id
          ? {
              ...interview,
              status: "Cancelled",
            }
          : interview
      )
    );

    setShowCancelModal(false);
    setSelectedInterview(null);
  };

  const markCompleted = (id: string) => {
    setInterviews((current) =>
      current.map((interview) =>
        interview.id === id
          ? {
              ...interview,
              status: "Completed",
              feedback:
                "Interview completed successfully. Candidate showed good performance.",
            }
          : interview
      )
    );
  };

  const statusClass = (status: InterviewStatus) => {
    if (status === "Completed") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-slate-900">
      <Header />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">

        {/* SUMMARY */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Interviews</p>
            <p className="mt-2 text-3xl font-bold">{summary.total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Scheduled</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {summary.scheduled}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {summary.completed}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {summary.cancelled}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* CENTER */}
          <section className="space-y-6">

            {/* INVITATIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h2 className="text-xl font-semibold">
                  Interview Invitations
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Manage and schedule candidate meetings.
                </p>
              </div>

              {/* SEARCH + FILTER */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate or position..."
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#0880EF]"
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target.value as
                        | "All"
                        | InterviewStatus
                    )
                  }
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
                >
                  <option value="All">All Interviews</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mt-6 space-y-4">
                {filteredInterviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    No interviews found.
                  </div>
                ) : (
                  filteredInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <p className="font-semibold">
                            {interview.company}
                          </p>

                          <p className="text-sm text-slate-600">
                            {interview.role}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {interview.dateLabel}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {interview.mode}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                          <button
                            type="button"
                            onClick={() => openDetails(interview)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                          >
                            View Details
                          </button>

                          {interview.status === "Scheduled" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  openScheduleModal(interview)
                                }
                                className="rounded-lg bg-[#0880EF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0A67C6]"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openCancelModal(interview)
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {interview.status === "Completed" && (
                            <button
                              type="button"
                              onClick={() =>
                                openFeedback(interview)
                              }
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                            >
                              View Feedback
                            </button>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                              interview.status
                            )}`}
                          >
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* CALENDAR */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold">
                Interview Calendar
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Upcoming interview meetings
              </p>

              <div className="mt-6 space-y-4">
                {interviews
                  .filter(
                    (interview) =>
                      interview.status === "Scheduled"
                  )
                  .map((interview) => (
                    <div
                      key={interview.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <h3 className="font-semibold">
                            {interview.company}
                          </h3>

                          <p className="text-sm text-slate-600">
                            Candidate: {interview.role}
                          </p>

                          <p className="text-sm text-slate-600">
                            Date & Time: {interview.dateLabel}
                          </p>

                          <p className="text-sm text-slate-600">
                            Platform: {interview.mode}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openDetails(interview)}
                            className="rounded-lg bg-[#0880EF] px-3 py-2 text-xs font-semibold text-white"
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              markCompleted(interview.id)
                            }
                            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {summary.scheduled === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    No upcoming interviews.
                  </div>
                )}
              </div>
            </section>
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* ALERTS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">
                Recent Alerts
              </h3>

              <div className="mt-4 space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-100 pb-3 text-sm text-slate-600"
                  >
                    {activity}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowActivityModal(true)}
                className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                View All Activity
              </button>
            </section>

            {/* PROGRESS */}
            <section className="rounded-2xl bg-gradient-to-br from-[#0A67C6] to-[#0880EF] p-6 text-white shadow-lg">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Hiring Progress
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                {progress}%
              </h3>

              <p className="mt-2 text-sm text-white/90">
                {summary.completed} of {summary.total} interviews completed.
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 text-center text-xs">
                <div>
                  <p className="font-bold">{summary.scheduled}</p>
                  <p className="text-white/70">Scheduled</p>
                </div>

                <div>
                  <p className="font-bold">{summary.completed}</p>
                  <p className="text-white/70">Completed</p>
                </div>

                <div>
                  <p className="font-bold">{summary.cancelled}</p>
                  <p className="text-white/70">Cancelled</p>
                </div>
              </div>
            </section>

            {/* WORKFLOW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="text-lg font-semibold">
                Recruiter Workflow
              </h3>

              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <span className="font-semibold text-slate-900">1.</span>{" "}
                  Review candidate applications.
                </li>

                <li>
                  <span className="font-semibold text-slate-900">2.</span>{" "}
                  Shortlist suitable candidates.
                </li>

                <li>
                  <span className="font-semibold text-slate-900">3.</span>{" "}
                  Schedule an interview.
                </li>

                <li>
                  <span className="font-semibold text-slate-900">4.</span>{" "}
                  Complete the interview.
                </li>

                <li>
                  <span className="font-semibold text-slate-900">5.</span>{" "}
                  Review feedback and make the final decision.
                </li>
              </ol>
            </section>
          </aside>
        </div>
      </main>

      {/* SCHEDULE / RESCHEDULE MODAL */}
      {showScheduleModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Reschedule Interview
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {selectedInterview.company} — {selectedInterview.role}
            </p>

            <div className="mt-5 space-y-4">

              <div>
                <label className="text-sm font-medium">
                  Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Time
                </label>

                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) =>
                    setSelectedTime(e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedInterview(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveSchedule}
                disabled={!selectedDate || !selectedTime}
                className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Cancel Interview?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to cancel the interview with{" "}
              <strong>{selectedInterview.role}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedInterview(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Keep Interview
              </button>

              <button
                type="button"
                onClick={confirmCancel}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Cancel Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedInterview &&
        !showScheduleModal &&
        !showFeedbackModal &&
        !showActivityModal &&
        !showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <h2 className="text-xl font-semibold">
                Interview Details
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <p>
                  <strong>Position:</strong>{" "}
                  {selectedInterview.company}
                </p>

                <p>
                  <strong>Candidate:</strong>{" "}
                  {selectedInterview.role}
                </p>

                <p>
                  <strong>Date & Time:</strong>{" "}
                  {selectedInterview.dateLabel}
                </p>

                <p>
                  <strong>Platform:</strong>{" "}
                  {selectedInterview.mode}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {selectedInterview.status}
                </p>
              </div>

              {selectedInterview.status === "Scheduled" &&
                selectedInterview.meetingLink && (
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block rounded-lg bg-[#0880EF] px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Join Meeting
                  </a>
                )}

              <button
                type="button"
                onClick={() => setSelectedInterview(null)}
                className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Interview Feedback
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Candidate: {selectedInterview.role}
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {selectedInterview.feedback ||
                "No feedback available."}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowFeedbackModal(false);
                setSelectedInterview(null);
              }}
              className="mt-5 w-full rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              Recent Activity
            </h2>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {activities.map((activity, index) => (
                <p key={index}>• {activity}</p>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowActivityModal(false)}
              className="mt-6 w-full rounded-lg bg-[#0880EF] px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
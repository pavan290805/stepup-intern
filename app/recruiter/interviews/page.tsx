"use client";

import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { apiFetch } from "@/lib/api";

const recentResultsFallback = [
  {
    id: "demo-1",
    name: "Elena Gilbert",
    initials: "EG",
    avatarBg: "bg-blue-500",
    role: "Marketing Intern",
    statusLabel: "Completed",
    statusColor: "text-green-600",
    statusDot: "bg-green-500",
    score: "4.8",
    max: "5.0",
    feedback: "Strong product sense and clear communication.",
    rating: 5,
  },
  {
    id: "demo-2",
    name: "Marcus Wright",
    initials: "MW",
    avatarBg: "bg-gray-700",
    role: "DevOps Intern",
    statusLabel: "Hold",
    statusColor: "text-gray-500",
    statusDot: "bg-gray-400",
    score: "3.2",
    max: "5.0",
    feedback: "Good systems knowledge, but needs stronger depth on deployment tradeoffs.",
    rating: 3,
  },
];

const teamAvailability = [
  { name: "John Doe", initials: "JD", bg: "bg-blue-500", status: "Available", statusColor: "text-green-600" },
  { name: "Alice Smith", initials: "AS", bg: "bg-amber-500", status: "In Meeting", statusColor: "text-amber-600" },
  { name: "Ben Kim", initials: "BK", bg: "bg-blue-800", status: "Busy", statusColor: "text-red-500" },
];

export default function InterviewsPage() {
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [recentInterviewResults, setRecentInterviewResults] = useState<any[]>(recentResultsFallback);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRescheduleInterview, setSelectedRescheduleInterview] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<"view" | "edit">("view");
  const [selectedFeedbackInterview, setSelectedFeedbackInterview] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("5");

  useEffect(() => {
    const mapInterview = (interview: any) => {
      const application = interview.applicationId;
      const studentUser = application?.studentId?.userId;
      const internship = application?.internshipId;
      const name = studentUser?.name || studentUser?.email || "Applicant";
      const scheduledAt = interview.scheduledAt ? new Date(interview.scheduledAt) : new Date();

      return {
        id: interview._id,
        name,
        initials: name
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        avatarBg: "bg-blue-500",
        role: internship?.title || "Internship",
        roleColor: "text-blue-500",
        date: scheduledAt.toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        scheduledAtISO: scheduledAt.toISOString(),
        avatar: name
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        meetingLink: interview.meetingLink || "",
        available: interview.status === "scheduled",
        status: interview.status,
        feedback: interview.feedback || "",
        rating: typeof interview.rating === "number" ? interview.rating : 0,
        score: interview.rating ? String(interview.rating) : "—",
        max: "5.0",
        statusLabel:
          interview.status === "completed"
            ? "Completed"
            : interview.status === "cancelled"
              ? "Cancelled"
              : "Scheduled",
        statusColor:
          interview.status === "completed"
            ? "text-green-600"
            : interview.status === "cancelled"
              ? "text-red-500"
              : "text-gray-500",
        statusDot:
          interview.status === "completed"
            ? "bg-green-500"
            : interview.status === "cancelled"
              ? "bg-red-500"
              : "bg-gray-400",
      };
    };

    const loadInterviews = async () => {
      try {
        const [scheduledResponse, completedResponse] = await Promise.all([
          apiFetch("/interviews?limit=10&status=scheduled"),
          apiFetch("/interviews?limit=10&status=completed"),
        ]);

        const backendScheduled = scheduledResponse?.data?.interviews || [];
        const backendCompleted = completedResponse?.data?.interviews || [];

        setUpcomingInterviews(backendScheduled.map(mapInterview));
        setRecentInterviewResults(backendCompleted.length ? backendCompleted.map(mapInterview) : recentResultsFallback);
      } catch (error) {
        if (!(error instanceof Error && error.message.includes("404"))) {
          console.error(error);
        }
      }
    };

    loadInterviews();
  }, []);

  const openRescheduleModal = (interview: any) => {
    setSelectedRescheduleInterview(interview);
    const scheduled = interview?.scheduledAtISO ? new Date(interview.scheduledAtISO) : new Date();
    setRescheduleDate(scheduled.toISOString().slice(0, 10));
    setRescheduleTime(scheduled.toISOString().slice(11, 16));
    setShowRescheduleModal(true);
  };

  const handleJoinMeeting = (meetingLink: string) => {
    if (!meetingLink) {
      return;
    }

    window.open(meetingLink, "_blank", "noopener,noreferrer");
  };

  const openFeedbackModal = (interview: any, mode: "view" | "edit") => {
    setSelectedFeedbackInterview(interview);
    setFeedbackText(interview?.feedback || "");
    setFeedbackRating(interview?.rating ? String(interview.rating) : "5");
    setFeedbackMode(mode);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    const interview = upcomingInterviews[0] || recentInterviewResults[0] || null;
    openFeedbackModal(interview, "edit");
  };

  const saveReschedule = async () => {
    if (!selectedRescheduleInterview || !rescheduleDate || !rescheduleTime) {
      return;
    }

    try {
      const scheduledAt = new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString();

      await apiFetch(`/interviews/${selectedRescheduleInterview.id}`, {
        method: "PATCH",
        body: JSON.stringify({ scheduledAt }),
      });

      setUpcomingInterviews((prev) =>
        prev.map((interview) =>
          interview.id === selectedRescheduleInterview.id
            ? {
                ...interview,
                scheduledAtISO: scheduledAt,
                date: new Date(scheduledAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                }),
              }
            : interview
        )
      );

      setShowRescheduleModal(false);
      setSelectedRescheduleInterview(null);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFeedback = async () => {
    if (!selectedFeedbackInterview) {
      return;
    }

    try {
      await apiFetch(`/interviews/${selectedFeedbackInterview.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "completed",
          feedback: feedbackText,
          rating: Number(feedbackRating),
        }),
      });

      const completedEntry = {
        ...selectedFeedbackInterview,
        feedback: feedbackText,
        rating: Number(feedbackRating),
        score: Number(feedbackRating).toFixed(1),
        status: "completed",
        statusLabel: "Completed",
        statusColor: "text-green-600",
        statusDot: "bg-green-500",
      };

      setUpcomingInterviews((prev) => prev.filter((interview) => interview.id !== selectedFeedbackInterview.id));
      setRecentInterviewResults((prev) => [completedEntry, ...prev.filter((interview) => interview.id !== selectedFeedbackInterview.id)]);
      setShowFeedbackModal(false);
      setSelectedFeedbackInterview(null);
      setFeedbackText("");
      setFeedbackRating("5");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Interview Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your <span className="text-blue-500 font-medium">upcoming</span> meetings and candidate evaluations.
          </p>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Today</h2>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 font-medium border-r border-gray-200 hover:bg-gray-50 ${viewMode === "list" ? "bg-white text-gray-700" : "text-gray-500"}`}>
                    List
                  </button>
                  <button onClick={() => setViewMode("calendar")} className={`px-3 py-1.5 hover:bg-gray-50 ${viewMode === "calendar" ? "bg-white text-gray-700 font-medium" : "text-gray-500"}`}>
                    Calendar
                  </button>
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${interview.avatarBg} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                        {interview.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{interview.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={`text-xs font-medium ${interview.roleColor}`}>{interview.role}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {interview.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => openRescheduleModal(interview)} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleJoinMeeting(interview.meetingLink)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                            interview.available && interview.meetingLink
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!interview.available || !interview.meetingLink}
                        >
                          Join Meeting
                        </button>
                      </div>
                    </div>
                  ))}

                  {upcomingInterviews.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                      No upcoming interviews were returned by the backend yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  Calendar view is not wired to a separate data source yet. Switch back to List to manage interviews.
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Results</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    {["Candidate", "Role", "Status", "Score", ""].map((col) => (
                      <th key={col} className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentInterviewResults.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${r.avatarBg} flex items-center justify-center text-white text-xs font-semibold`}>
                            {r.initials}
                          </div>
                          <span className="text-sm font-medium text-blue-600">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-blue-500">{r.role}</td>
                      <td className="py-3 pr-4">
                        <span className={`flex items-center gap-1.5 text-sm font-medium ${r.statusColor}`}>
                          <span className={`w-2 h-2 rounded-full ${r.statusDot}`} />
                          {r.statusLabel}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm">
                        <span className="font-semibold text-gray-900">{r.score}</span>
                        <span className="text-blue-500 font-medium">/{r.max}</span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => openFeedbackModal(r, "view")} className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap">
                          View Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="bg-blue-600 rounded-xl p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">Interviews Today</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">08</span>
                <span className="text-sm text-blue-200">Total scheduled</span>
              </div>
              <div className="flex justify-between border-t border-blue-500 pt-4">
                <div>
                  <p className="text-xs text-blue-200">Completed</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">Remaining</p>
                  <p className="text-2xl font-bold mt-1">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Pending Feedback</h3>
              <p className="text-xs text-gray-500 mb-4">
                You have <span className="text-blue-600 font-semibold">2 interviews</span> that need your final evaluation scores.
              </p>
              <button onClick={handleSubmitFeedback} className="w-full bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition">
                Submit Feedback
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Team Availability</h3>
              <div className="space-y-3">
                {teamAvailability.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${member.bg} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                      {member.initials}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{member.name}</span>
                    <span className={`text-xs font-medium ${member.statusColor}`}>{member.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">StepUp Intern</p>
            <p className="text-xs text-gray-400 mt-0.5">© 2024 StepUp Intern. All rights reserved.</p>
          </div>
          <div className="flex gap-5 text-xs text-gray-500">
            {[
              "Support",
              "Privacy Policy",
              "Terms of Service",
              "Help Center",
            ].map((link) => (
              <a key={link} href="#" className="hover:text-blue-600 transition">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {showRescheduleModal && selectedRescheduleInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">Reschedule Interview</h2>
            <p className="mt-1 text-sm text-gray-500">Update the scheduled time for {selectedRescheduleInterview.name}.</p>
            <div className="mt-5 space-y-3">
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
              <input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowRescheduleModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={saveReschedule} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              {feedbackMode === "edit" ? "Submit Feedback" : "View Feedback"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedFeedbackInterview
                ? `Interview with ${selectedFeedbackInterview.name}`
                : "Choose an interview to review."}
            </p>

            <div className="mt-5 space-y-3">
              {feedbackMode === "edit" && upcomingInterviews.length > 0 && (
                <select
                  value={selectedFeedbackInterview?.id || ""}
                  onChange={(e) => {
                    const nextInterview = upcomingInterviews.find((item) => String(item.id) === e.target.value);
                    if (nextInterview) {
                      setSelectedFeedbackInterview(nextInterview);
                      setFeedbackText(nextInterview.feedback || "");
                      setFeedbackRating(nextInterview.rating ? String(nextInterview.rating) : "5");
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                >
                  {upcomingInterviews.map((interview) => (
                    <option key={interview.id} value={interview.id}>
                      {interview.name} - {interview.role}
                    </option>
                  ))}
                </select>
              )}

              {selectedFeedbackInterview ? (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    disabled={feedbackMode === "view"}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm disabled:bg-gray-50"
                    placeholder="Rating"
                  />
                  <input
                    type="text"
                    value={selectedFeedbackInterview.role || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-gray-50"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  No interview is selected yet.
                </div>
              )}

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={feedbackMode === "view"}
                rows={5}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm disabled:bg-gray-50"
                placeholder="Write feedback here"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowFeedbackModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Close
              </button>
              {feedbackMode === "edit" && (
                <button onClick={saveFeedback} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
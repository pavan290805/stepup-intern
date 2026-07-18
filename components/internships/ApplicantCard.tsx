import { useState } from "react";
import type { Applicant } from "../hooks/useApplicants";

type ApplicantCardProps = {
  applicant: Applicant;
  onShortlist: () => void;
  onReject: () => void;
  onScheduleInterview: () => void;
  onSendEmail: () => void;
  onViewResume: () => void;
  onDownloadResume: () => void;
  onDelete: () => void;
};

export default function ApplicantCard({
  applicant,
  onShortlist,
  onReject,
  onScheduleInterview,
  onSendEmail,
  onViewResume,
  onDownloadResume,
  onDelete,
}: ApplicantCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-lg font-semibold text-white">
          {getInitials(applicant.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid gap-2 text-sm sm:grid-cols-[minmax(0,280px)_minmax(0,280px)_minmax(0,220px)]">
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">{applicant.name}</p>
              <p className="mt-1 text-sm text-slate-600 truncate">{applicant.email}</p>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">Phone</p>
              <p className="mt-1 text-sm text-slate-600 truncate">{applicant.phone}</p>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">Current Status</p>
              <p className="mt-1">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onViewResume}
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        >
          View Resume
        </button>
        <button
          type="button"
          onClick={onDownloadResume}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
        >
          Download Resume
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:border-blue-400 hover:text-blue-600"
          >
            More ▼
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-xl z-10">
              <button
                type="button"
                onClick={() => handleAction(onShortlist)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50"
              >
                <span>⭐</span>
                <span>Shortlist</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onReject)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <span>❌</span>
                <span>Reject Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onScheduleInterview)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50"
              >
                <span>📅</span>
                <span>Schedule Interview</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onSendEmail)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span>📧</span>
                <span>Send Email</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onDelete)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <span>🗑️</span>
                <span>Remove Application</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

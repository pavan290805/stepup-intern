"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Internship } from "../hooks/useRecruiterInternships";
import { useApplicants } from "../hooks/useApplicants";
import { useRecruiterInternshipContext } from "../context/RecruiterInternshipContext";
import ApplicantCard from "./ApplicantCard";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import SendEmailModal from "./SendEmailModal";
import ViewResumeModal from "./ViewResumeModal";

export default function InternshipApplicantsPage() {
  const { selectedInternship } = useRecruiterInternshipContext();
  const router = useRouter();
  if (!selectedInternship) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No internship selected</h2>
        <p>Please select an internship from the recruiter dashboard.</p>
      </div>
    );
  }

  const internship = selectedInternship;

  const {
    getInternshipApplicants,
    getInternshipInterviews,
    shortlistApplicant,
    rejectApplicant,
    scheduleInterview,
    deleteApplication,
    sendEmail,
  } = useApplicants();

  const applicants = getInternshipApplicants(internship.id);
  const interviews = getInternshipInterviews(internship.id);

  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    "schedule" | "email" | "view-resume" | null
  >(null);

  const selectedApplicant = applicants.find(
    (a) => a.id === selectedApplicantId
  );
const handleAction = (action: string, applicantId: string) => {
  setSelectedApplicantId(applicantId);

  switch (action) {
    case "schedule":
      setModalType("schedule");
      break;

    case "email":
      setModalType("email");
      break;

    case "view-resume":
      setModalType("view-resume");
      break;

    case "shortlist":
      shortlistApplicant(applicantId);
      break;

    case "reject":
      rejectApplicant(applicantId);
      break;

    case "delete":
      if (
        window.confirm(
          "Are you sure you want to remove this application? This action cannot be undone."
        )
      ) {
        deleteApplication(applicantId);
      }
      break;

    case "download-resume":
      const applicant = applicants.find((a) => a.id === applicantId);

      if (applicant) {
        const link = document.createElement("a");
        link.href = applicant.resumeUrl;
        link.download = `${applicant.name}-resume.pdf`;
        link.click();
      }
      break;
  }
};

  const handleScheduleInterview = (date: string, time: string) => {
    if (selectedApplicantId) {
      scheduleInterview(selectedApplicantId, internship.id, date, time);
      setModalType(null);
      setSelectedApplicantId(null);
    }
  };

  const handleSendEmail = (subject: string, message: string) => {
    if (selectedApplicantId) {
      sendEmail(selectedApplicantId, subject, message);
      setModalType(null);
      setSelectedApplicantId(null);
      alert("Email sent successfully!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const applicantStats = [
    {
      label: "Total Applicants",
      value: applicants.length,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Shortlisted",
      value: applicants.filter((a) => a.status === "Shortlisted").length,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Scheduled Interviews",
      value: interviews.length,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Rejected",
      value: applicants.filter((a) => a.status === "Rejected").length,
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            ← Back to Listings
          </button>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,520px)] lg:items-end">
            <div className="min-w-0">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {internship.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
                <span>{internship.department}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                <span>{internship.location}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                <span>{internship.type}</span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Posted on {formatDate(internship.createdAt)} · Deadline: {formatDate(internship.deadline)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Job Type
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900">{internship.type}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Workspace
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900">{internship.location}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Stipend
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  {internship.stipend}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {applicantStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-slate-200 p-4 ${stat.color}`}
            >
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Applicants Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Applicants</h2>
          <p className="text-sm text-slate-600 mb-6">
            Review and manage talent pipeline
          </p>

          {applicants.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-600">No applications yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onShortlist={() => handleAction("shortlist", applicant.id)}
                  onReject={() => handleAction("reject", applicant.id)}
                  onScheduleInterview={() =>
                    handleAction("schedule", applicant.id)
                  }
                  onSendEmail={() => handleAction("email", applicant.id)}
                  onViewResume={() =>
                    handleAction("view-resume", applicant.id)
                  }
                  onDownloadResume={() =>
                    handleAction("download-resume", applicant.id)
                  }
                  onDelete={() => handleAction("delete", applicant.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Interviews Section */}
        {interviews.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Scheduled Interviews ({interviews.length})
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => {
                const applicant = applicants.find(
                  (a) => a.id === interview.applicantId
                );
                return (
                  <div
                    key={interview.id}
                    className="rounded-lg border border-slate-200 p-4 bg-slate-50"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {applicant?.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      <p>📅 {formatDate(interview.date)}</p>
                      <p>🕐 {formatTime(`${interview.date}T${interview.time}`)}</p>
                      <p>📧 {applicant?.email}</p>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {interview.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {modalType === "schedule" && selectedApplicant && (
        <ScheduleInterviewModal
          applicantName={selectedApplicant.name}
          onClose={() => {
            setModalType(null);
            setSelectedApplicantId(null);
          }}
          onSchedule={handleScheduleInterview}
        />
      )}

      {modalType === "email" && selectedApplicant && (
        <SendEmailModal
          applicantName={selectedApplicant.name}
          applicantEmail={selectedApplicant.email}
          onClose={() => {
            setModalType(null);
            setSelectedApplicantId(null);
          }}
          onSend={handleSendEmail}
        />
      )}

      {modalType === "view-resume" && selectedApplicant && (
        <ViewResumeModal
          applicantName={selectedApplicant.name}
          resumeUrl={selectedApplicant.resumeUrl}
          onClose={() => {
            setModalType(null);
            setSelectedApplicantId(null);
          }}
        />
      )}
    </div>
  );
}

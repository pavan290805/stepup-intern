"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApplicationApiItem,
  type InterviewApiItem,
  type InternshipApiItem,
} from "@/lib/api";

export type ApplicationStatus = "Applied" | "Shortlisted" | "Rejected" | "Scheduled" | "Completed";

export type Applicant = {
  id: string;
  internshipId: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  scheduledInterviewDate?: string;
};

export type InterviewSchedule = {
  id: string;
  applicantId: string;
  internshipId: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

const capitalizeStatus = (status?: string): ApplicationStatus => {
  switch (status) {
    case "shortlisted":
      return "Shortlisted";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Rejected";
    case "interview_scheduled":
      return "Scheduled";
    case "selected":
      return "Completed";
    case "applied":
    case "under_review":
    default:
      return "Applied";
  }
};

const buildDisplayName = (student: ApplicationApiItem["studentId"]) => {
  if (typeof student === "object" && student) {
    if (typeof student.userId === "object" && student.userId) {
      return student.userId.name || student.name || student.userId.email || student.email || "Candidate";
    }

    return student.name || student.email || "Candidate";
  }

  return "Candidate";
};

const buildDisplayEmail = (student: ApplicationApiItem["studentId"]) => {
  if (typeof student === "object" && student) {
    if (typeof student.userId === "object" && student.userId) {
      return student.userId.email || student.email || "Not provided";
    }

    return student.email || "Not provided";
  }

  return "Not provided";
};

const buildDisplayPhone = () => "Not provided";

const mapInterviews = (interviews: InterviewApiItem[]) =>
  interviews.map<InterviewSchedule>((interview) => {
    const application = typeof interview.applicationId === "object" ? interview.applicationId : null;
    const internship = application && typeof application.internshipId === "object" ? application.internshipId : null;

    return {
      id: interview._id,
      applicantId: application?._id || String(interview.applicationId),
      internshipId: internship?._id || "",
      date: interview.scheduledAt.split("T")[0] || interview.scheduledAt,
      time: new Date(interview.scheduledAt).toISOString().slice(11, 16),
      status:
        interview.status === "completed"
          ? "Completed"
          : interview.status === "cancelled"
            ? "Cancelled"
            : "Scheduled",
    };
  });

const mapApplicants = (applications: ApplicationApiItem[], interviews: InterviewSchedule[]) =>
  applications.map<Applicant>((application) => {
    const student = application.studentId;
    const internship = typeof application.internshipId === "object" ? application.internshipId : null;
    const matchingInterview = interviews.find((interview) => interview.applicantId === application._id);
    const statusFromApplication = capitalizeStatus(application.status);

    return {
      id: application._id,
      internshipId: internship?._id || String(application.internshipId),
      applicationId: application._id,
      name: buildDisplayName(student),
      email: buildDisplayEmail(student),
      phone: buildDisplayPhone(),
      resumeUrl: application.resumeUrl || "/resumes/rahul-kumar.pdf",
      status: matchingInterview?.status === "Completed" ? "Completed" : matchingInterview ? "Scheduled" : statusFromApplication,
      appliedAt: application.appliedAt || application.createdAt || new Date().toISOString(),
      scheduledInterviewDate: matchingInterview ? `${matchingInterview.date}T${matchingInterview.time}:00.000Z` : undefined,
    };
  });

type BackendSnapshot = {
  applicants: Applicant[];
  interviews: InterviewSchedule[];
};

export function useApplicants() {
  const [snapshot, setSnapshot] = useState<BackendSnapshot>({ applicants: [], interviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await apiGet("/api/auth/me");
      const recruiterInterviews = await apiGet<{ interviews: InterviewApiItem[]; internships: InternshipApiItem[] }>(
        "/api/recruiters/interviews"
      );

      const interviewList = mapInterviews(recruiterInterviews.interviews);
      const applicantBuckets = await Promise.all(
        recruiterInterviews.internships.map((internship) =>
          apiGet<{ applications: ApplicationApiItem[] }>(`/api/internships/${internship._id}/applications?page=1&limit=100`)
        )
      );

      const applicants = applicantBuckets.flatMap((bucket) => mapApplicants(bucket.applications, interviewList));

      setSnapshot({ applicants, interviews: interviewList });
    } catch (err) {
      setSnapshot({ applicants: [], interviews: [] });
      setError(err instanceof Error ? err.message : "Failed to load applicant data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applicants = snapshot.applicants;
  const interviews = snapshot.interviews;

  const getInternshipApplicants = useCallback(
    (internshipId: string) => applicants.filter((applicant) => applicant.internshipId === internshipId),
    [applicants]
  );

  const getInternshipInterviews = useCallback(
    (internshipId: string) => interviews.filter((interview) => interview.internshipId === internshipId),
    [interviews]
  );

  const updateApplicantStatus = useCallback(
    async (applicantId: string, status: ApplicationStatus) => {
      const backendStatus =
        status === "Shortlisted"
          ? "shortlisted"
          : status === "Rejected"
            ? "rejected"
            : status === "Completed"
              ? "selected"
              : status === "Scheduled"
                ? "interview_scheduled"
                : "applied";

      await apiPatch(`/api/applications/${applicantId}`, { status: backendStatus });
      await refresh();
    },
    [refresh]
  );

  const shortlistApplicant = useCallback(
    async (applicantId: string) => {
      await updateApplicantStatus(applicantId, "Shortlisted");
    },
    [updateApplicantStatus]
  );

  const rejectApplicant = useCallback(
    async (applicantId: string) => {
      await updateApplicantStatus(applicantId, "Rejected");
    },
    [updateApplicantStatus]
  );

  const scheduleInterview = useCallback(
    async (applicantId: string, internshipId: string, date: string, time: string) => {
      const selectedApplicant = applicants.find((applicant) => applicant.id === applicantId && applicant.internshipId === internshipId);
      if (!selectedApplicant) {
        throw new Error("Applicant not found");
      }

      const scheduledAt = new Date(`${date}T${time}:00.000Z`).toISOString();
      await apiPost("/api/interviews", {
        applicationId: selectedApplicant.applicationId,
        scheduledAt,
        mode: "online",
      });
      await apiPatch(`/api/applications/${selectedApplicant.applicationId}`, { status: "interview_scheduled" });
      await refresh();
    },
    [applicants, refresh]
  );

  const deleteApplication = useCallback(
    async (applicantId: string) => {
      const selectedApplicant = applicants.find((applicant) => applicant.id === applicantId);
      if (!selectedApplicant) {
        return;
      }

      await apiDelete(`/api/applications/${selectedApplicant.applicationId}`);
      await refresh();
    },
    [applicants, refresh]
  );

  const sendEmail = useCallback((applicantId: string, subject: string, message: string) => {
    const selectedApplicant = applicants.find((applicant) => applicant.id === applicantId);
    if (!selectedApplicant) {
      return;
    }

    const body = encodeURIComponent(message);
    const mailto = `mailto:${selectedApplicant.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailto, "_blank");
  }, [applicants]);

  const shortlistCount = useMemo(() => applicants.filter((applicant) => applicant.status === "Shortlisted").length, [applicants]);

  return {
    applicants,
    interviews,
    shortlistCount,
    loading,
    error,
    refresh,
    getInternshipApplicants,
    getInternshipInterviews,
    updateApplicantStatus,
    shortlistApplicant,
    rejectApplicant,
    scheduleInterview,
    deleteApplication,
    sendEmail,
  };
}

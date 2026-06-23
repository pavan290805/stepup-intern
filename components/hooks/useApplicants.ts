"use client";

import { useMemo, useSyncExternalStore } from "react";

export type ApplicationStatus = "Applied" | "Shortlisted" | "Rejected" | "Scheduled" | "Completed";

export type Applicant = {
  id: string;
  internshipId: string;
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

const APPLICANTS_STORAGE_KEY = "stepup-applicants";
const INTERVIEWS_STORAGE_KEY = "stepup-interviews";

const applicantListeners = new Set<() => void>();
const interviewListeners = new Set<() => void>();

let cachedApplicants: Applicant[] = [];
let cachedInterviews: InterviewSchedule[] = [];
let applicantsCacheInitialized = false;
let interviewsCacheInitialized = false;

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Helper function to get first internship ID from storage
const getFirstInternshipId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    const internshipsRaw = window.localStorage.getItem("stepup-internship-listings");
    if (internshipsRaw) {
      const internships = JSON.parse(internshipsRaw);
      if (Array.isArray(internships) && internships.length > 0) {
        return internships[0].id;
      }
    }
  } catch {
    return null;
  }
  return null;
};

// Function to generate sample applicants with correct internship ID
const generateSampleApplicants = (): Applicant[] => {
  const internshipId = getFirstInternshipId() || "frontend-1"; // Fallback to "frontend-1"
  
  return [
    {
      id: createId(),
      internshipId: internshipId,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "+91 98765 43210",
      resumeUrl: "/resumes/rahul-kumar.pdf",
      status: "Applied",
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "+91 97654 32109",
      resumeUrl: "/resumes/priya-sharma.pdf",
      status: "Scheduled",
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledInterviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Arjun Patel",
      email: "arjun.patel@gmail.com",
      phone: "+91 99876 54321",
      resumeUrl: "/resumes/arjun-patel.pdf",
      status: "Shortlisted",
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Neha Verma",
      email: "neha.verma@gmail.com",
      phone: "+91 98765 12345",
      resumeUrl: "/resumes/neha-verma.pdf",
      status: "Applied",
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Vikram Singh",
      email: "vikram.singh@gmail.com",
      phone: "+91 96543 21098",
      resumeUrl: "/resumes/vikram-singh.pdf",
      status: "Rejected",
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Anjali Dubey",
      email: "anjali.dubey@gmail.com",
      phone: "+91 95432 10987",
      resumeUrl: "/resumes/anjali-dubey.pdf",
      status: "Applied",
      appliedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Rohan Desai",
      email: "rohan.desai@gmail.com",
      phone: "+91 94321 09876",
      resumeUrl: "/resumes/rohan-desai.pdf",
      status: "Shortlisted",
      appliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Divya Gupta",
      email: "divya.gupta@gmail.com",
      phone: "+91 97890 12345",
      resumeUrl: "/resumes/divya-gupta.pdf",
      status: "Completed",
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledInterviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Sanjay Rao",
      email: "sanjay.rao@gmail.com",
      phone: "+91 98901 23456",
      resumeUrl: "/resumes/sanjay-rao.pdf",
      status: "Shortlisted",
      appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: createId(),
      internshipId: internshipId,
      name: "Isha Malhotra",
      email: "isha.malhotra@gmail.com",
      phone: "+91 96543 87654",
      resumeUrl: "/resumes/isha-malhotra.pdf",
      status: "Applied",
      appliedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

const readStoredApplicants = (): Applicant[] => {
  if (typeof window === "undefined") {
    return cachedApplicants;
  }

  const rawValue = window.localStorage.getItem(APPLICANTS_STORAGE_KEY);
  if (!rawValue) {
    // Initialize with sample data on first load
    if (!applicantsCacheInitialized) {
      // Always regenerate with current internship ID
      const samples = generateSampleApplicants();
      window.localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Applicant[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const readStoredInterviews = (): InterviewSchedule[] => {
  if (typeof window === "undefined") {
    return cachedInterviews;
  }

  const rawValue = window.localStorage.getItem(INTERVIEWS_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as InterviewSchedule[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const writeStoredApplicants = (nextApplicants: Applicant[]) => {
  if (typeof window === "undefined") {
    return;
  }

  cachedApplicants = nextApplicants;
  applicantsCacheInitialized = true;
  window.localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(nextApplicants));
  applicantListeners.forEach((listener) => listener());
};

const writeStoredInterviews = (nextInterviews: InterviewSchedule[]) => {
  if (typeof window === "undefined") {
    return;
  }

  cachedInterviews = nextInterviews;
  interviewsCacheInitialized = true;
  window.localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(nextInterviews));
  interviewListeners.forEach((listener) => listener());
};

const subscribeApplicants = (listener: () => void) => {
  applicantListeners.add(listener);
  return () => {
    applicantListeners.delete(listener);
  };
};

const subscribeInterviews = (listener: () => void) => {
  interviewListeners.add(listener);
  return () => {
    interviewListeners.delete(listener);
  };
};

const getApplicantsSnapshot = () => {
  if (typeof window === "undefined") {
    return cachedApplicants;
  }

  if (!applicantsCacheInitialized) {
    cachedApplicants = readStoredApplicants();
    applicantsCacheInitialized = true;
  }

  return cachedApplicants;
};

const getInterviewsSnapshot = () => {
  if (typeof window === "undefined") {
    return cachedInterviews;
  }

  if (!interviewsCacheInitialized) {
    cachedInterviews = readStoredInterviews();
    interviewsCacheInitialized = true;
  }

  return cachedInterviews;
};

const SERVER_SNAPSHOT: Applicant[] = [];
const INTERVIEWS_SERVER_SNAPSHOT: InterviewSchedule[] = [];

export const useApplicants = () => {
  const applicants = useSyncExternalStore(subscribeApplicants, getApplicantsSnapshot, () => SERVER_SNAPSHOT);
  const interviews = useSyncExternalStore(subscribeInterviews, getInterviewsSnapshot, () => INTERVIEWS_SERVER_SNAPSHOT);

  const getInternshipApplicants = (internshipId: string) => {
    return applicants.filter((applicant) => applicant.internshipId === internshipId);
  };

  const getInternshipInterviews = (internshipId: string) => {
    return interviews.filter((interview) => interview.internshipId === internshipId);
  };

  const updateApplicantStatus = (applicantId: string, status: ApplicationStatus) => {
    const currentApplicants = getApplicantsSnapshot();
    const updated = currentApplicants.map((applicant) =>
      applicant.id === applicantId ? { ...applicant, status } : applicant,
    );
    writeStoredApplicants(updated);
  };

  const shortlistApplicant = (applicantId: string) => {
    updateApplicantStatus(applicantId, "Shortlisted");
  };

  const rejectApplicant = (applicantId: string) => {
    updateApplicantStatus(applicantId, "Rejected");
  };

  const scheduleInterview = (applicantId: string, internshipId: string, date: string, time: string) => {
    const currentApplicants = getApplicantsSnapshot();
    const updated: Applicant[] = currentApplicants.map((applicant) =>
      applicant.id === applicantId
        ? { ...applicant, status: "Scheduled" as const, scheduledInterviewDate: `${date}T${time}` }
        : applicant,
    );
    writeStoredApplicants(updated);

    const currentInterviews = getInterviewsSnapshot();
    const newInterview: InterviewSchedule = {
      id: createId(),
      applicantId,
      internshipId,
      date,
      time,
      status: "Scheduled",
    };
    writeStoredInterviews([...currentInterviews, newInterview]);
  };

  const deleteApplication = (applicantId: string) => {
    const currentApplicants = getApplicantsSnapshot();
    const filtered = currentApplicants.filter((applicant) => applicant.id !== applicantId);
    writeStoredApplicants(filtered);
  };

  const sendEmail = (applicantId: string, subject: string, message: string) => {
    // This would integrate with an email service
    console.log(`Email sent to applicant ${applicantId}:`, { subject, message });
  };

  return {
    applicants,
    interviews,
    getInternshipApplicants,
    getInternshipInterviews,
    updateApplicantStatus,
    shortlistApplicant,
    rejectApplicant,
    scheduleInterview,
    deleteApplication,
    sendEmail,
  };
};

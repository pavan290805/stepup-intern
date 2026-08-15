"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { apiFetch } from "@/lib/api";
export interface Interview {
  id: string;
  applicationId?: string;
  candidateId?: string;
  recruiterId?: string;

  name: string;
  role: string;

  meetingLink: string;

  status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rescheduled";

  feedback: string;
  rating: number;

  scheduledAtISO: string;

  initials: string;
  avatar: string;
  avatarBg: string;

  roleColor: string;

  date: string;

  available: boolean;

  score: string;
  max: string;

  statusLabel: string;
  statusColor: string;
  statusDot: string;
}
interface InterviewContextType {
  interviews: Interview[];
  loading: boolean;

  fetchInterviews: () => Promise<void>;

  createInterview: (
    data: Partial<Interview>
  ) => Promise<void>;

  updateInterview: (
    id: string,
    data: Partial<Interview>
  ) => Promise<void>;

  deleteInterview: (
    id: string
  ) => Promise<void>;

  refresh: () => Promise<void>;
}

const InterviewContext =
  createContext<InterviewContextType | null>(null);

export function InterviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

const fetchInterviews = useCallback(async () => {
  setLoading(true);

  try {

const scheduledResponse = await apiFetch<{
  interviews: Array<{
    _id: string;
    meetingLink?: string;
    scheduledAt?: string;
    status: "scheduled" | "completed" | "cancelled" | "rescheduled";
    feedback?: string;
    rating?: number;
    applicationId?: {
      studentId?: {
        userId?: {
          name?: string;
        };
      };
      internshipId?: {
        title?: string;
      };
    };
  }>;
}>("/recruiters/interviews");

const backendInterviews = scheduledResponse?.data?.interviews ?? [];

setInterviews(
  backendInterviews.map(
  (
    item: {
      _id: string;
      meetingLink?: string;
      scheduledAt?: string;
      status:
        | "scheduled"
        | "completed"
        | "cancelled"
        | "rescheduled";
      feedback?: string;
      rating?: number;
      applicationId?: {
        studentId?: {
          userId?: {
            name?: string;
          };
        };
        internshipId?: {
          title?: string;
        };
      };
    }
  ) => ({
    id: item._id,

    name:
      item.applicationId?.studentId?.userId?.name ??
      "Unknown Candidate",

    role:
      item.applicationId?.internshipId?.title ??
      "Intern",

    meetingLink: item.meetingLink ?? "",

    scheduledAtISO: item.scheduledAt || new Date().toISOString(),

    date: item.scheduledAt
      ? new Date(item.scheduledAt).toLocaleString()
      : "",

    available: item.status === "scheduled",

    feedback: item.feedback ?? "",

    rating: item.rating ?? 0,

    initials:
      (item.applicationId?.studentId?.userId?.name ?? "U")
        .split(" ")
        .map((x: string) => x[0])
        .join("")
        .slice(0, 2),

    avatar: "",

    avatarBg: "bg-blue-500",

    roleColor: "text-blue-600",

    score: String(item.rating ?? 0),

    max: "5.0",

    status: item.status,

    statusLabel: item.status,

    statusColor:
      item.status === "completed"
        ? "text-green-600"
        : "text-yellow-600",

    statusDot:
      item.status === "completed"
        ? "bg-green-500"
        : "bg-yellow-500",
  }))
);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, []);
const createInterview = useCallback(
  async (data: Partial<Interview>) => {
    const res = await apiFetch<Interview>("/interviews", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const createdInterview = res.data;

    if (createdInterview) {
      setInterviews((prev) => [createdInterview, ...prev]);
    }
  },
  []
);

const updateInterview = useCallback(
  async (id: string, data: Partial<Interview>) => {
    await apiFetch(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    setInterviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
            }
          : item
      )
    );
  },
  []
);

  const deleteInterview = useCallback(
    async (id: string) => {
      await apiFetch(`/interviews/${id}`, {
      method: "DELETE",
    });

      setInterviews((prev) =>
        prev.filter((item) => item.id !== id)
      );
    },
    []
  );
const value = useMemo(
  () => ({
    interviews,
    loading,
    fetchInterviews,
    createInterview,
    updateInterview,
    deleteInterview,
    refresh: fetchInterviews,
  }),
  [
    interviews,
    loading,
    fetchInterviews,
    createInterview,
    updateInterview,
    deleteInterview,
  ]
);
  return (
<InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used inside InterviewProvider"
    );
  }

  return context;
}

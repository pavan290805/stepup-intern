"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  listStudentApplications,
  listSavedInternships,
  getInterview,
  type ApplicationApiItem,
  type InterviewApiItem,
} from "@/lib/api";

type PaginationState = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type SavedInternshipRecord = {
  _id?: string;
  internshipId?: ApplicationApiItem["internshipId"] | null;
  createdAt?: string;
  updatedAt?: string;
};

type StudentActivityContextValue = {
  applications: ApplicationApiItem[];
  savedInternships: SavedInternshipRecord[];
  selectedInterview: InterviewApiItem | null;
  applicationsPagination: PaginationState | null;
  savedPagination: PaginationState | null;
  loading: boolean;
  error: string | null;
  loadMyApplications: (page?: number, limit?: number) => Promise<void>;
  loadSavedInternships: (page?: number, limit?: number) => Promise<void>;
  loadInterviewById: (id: string) => Promise<void>;
  clearSelectedInterview: () => void;
};

const StudentActivityContext = createContext<StudentActivityContextValue | undefined>(undefined);

export function StudentActivityProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<ApplicationApiItem[]>([]);
  const [savedInternships, setSavedInternships] = useState<SavedInternshipRecord[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewApiItem | null>(null);
  const [applicationsPagination, setApplicationsPagination] = useState<PaginationState | null>(null);
  const [savedPagination, setSavedPagination] = useState<PaginationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMyApplications = useCallback(async (page = 1, limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const result = await listStudentApplications({ page, limit });
      setApplications(result.applications ?? []);
      setApplicationsPagination(result.pagination ?? null);
    } catch (err) {
      setApplications([]);
      setApplicationsPagination(null);
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSavedInternships = useCallback(async (page = 1, limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const result = await listSavedInternships({ page, limit });
      const normalized = Array.isArray(result.internships)
        ? result.internships.map((entry) => {
            if (!entry || typeof entry !== "object") {
              return {} as SavedInternshipRecord;
            }

            const savedEntry = entry as Record<string, unknown>;
            const internshipId = savedEntry.internshipId;
            const record: SavedInternshipRecord = {
              _id: typeof savedEntry._id === "string" ? savedEntry._id : undefined,
              internshipId: typeof internshipId === "object" && internshipId !== null ? (internshipId as ApplicationApiItem["internshipId"]) : undefined,
              createdAt: typeof savedEntry.createdAt === "string" ? savedEntry.createdAt : undefined,
              updatedAt: typeof savedEntry.updatedAt === "string" ? savedEntry.updatedAt : undefined,
            };

            return record;
          })
        : [];

      setSavedInternships(normalized);
      setSavedPagination(result.pagination ?? null);
    } catch (err) {
      setSavedInternships([]);
      setSavedPagination(null);
      setError(err instanceof Error ? err.message : "Failed to load saved internships");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInterviewById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getInterview(id);
      setSelectedInterview(result);
    } catch (err) {
      setSelectedInterview(null);
      setError(err instanceof Error ? err.message : "Failed to load interview");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedInterview = useCallback(() => {
    setSelectedInterview(null);
  }, []);

  const value = useMemo<StudentActivityContextValue>(
    () => ({
      applications,
      savedInternships,
      selectedInterview,
      applicationsPagination,
      savedPagination,
      loading,
      error,
      loadMyApplications,
      loadSavedInternships,
      loadInterviewById,
      clearSelectedInterview,
    }),
    [applications, savedInternships, selectedInterview, applicationsPagination, savedPagination, loading, error, loadMyApplications, loadSavedInternships, loadInterviewById, clearSelectedInterview]
  );

  return <StudentActivityContext.Provider value={value}>{children}</StudentActivityContext.Provider>;
}

export function useStudentActivityContext() {
  const context = useContext(StudentActivityContext);
  if (!context) {
    throw new Error("useStudentActivityContext must be used within a StudentActivityProvider");
  }
  return context;
}

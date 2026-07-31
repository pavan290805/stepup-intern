"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type InternshipApiItem,
} from "@/lib/api";

export type InternshipStatus = "Draft" | "Active" | "Promoted" | "Closed";
export type Internship = {
  id: string;
  _id?: string;

  title: string;

  companyId?: {
    name?: string;
  };

  department: string;

  location: string;

  type: "Full-time" | "Part-time" | "Remote" | "Hybrid";

  stipend: string;

  deadline: string;

  duration?: string;

  description: string;

  responsibilities?: string[];

  skillsRequired?: string[];

  views?: number;

  status: InternshipStatus;

  featured: boolean;

  createdAt: string;
};

export type InternshipFormState = {
  title: string;
  department: string;
  location: string;
  type: Internship["type"];
  stipend: string;
  deadline: string;
  description: string;
};

type RecruiterInternshipResponse = {
  internships: InternshipApiItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

const emptyForm: InternshipFormState = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  stipend: "",
  deadline: "",
  description: "",
};

const formatStipend = (stipend?: number) => {
  if (typeof stipend !== "number" || Number.isNaN(stipend)) {
    return "";
  }

  return `₹${stipend.toLocaleString("en-IN")}`;
};

const formatDeadline = (deadline?: string) => {
  if (!deadline) {
    return "";
  }

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return deadline.split("T")[0] ?? deadline;
  }

  return parsed.toISOString().split("T")[0];
};

const mapWorkModeToType = (workMode?: InternshipApiItem["workMode"]): Internship["type"] => {
  switch (workMode) {
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    case "onsite":
    default:
      return "Full-time";
  }
};

const mapTypeToWorkMode = (type: Internship["type"]): NonNullable<InternshipApiItem["workMode"]> => {
  switch (type) {
    case "Remote":
      return "remote";
    case "Hybrid":
      return "hybrid";
    case "Part-time":
    case "Full-time":
    default:
      return "onsite";
  }
};

const normalizeStatus = (status?: InternshipApiItem["status"], featured?: boolean): InternshipStatus => {
  if (status === "draft") {
    return "Draft";
  }
  if (status === "closed") {
    return "Closed";
  }
  return featured ? "Promoted" : "Active";
};

const mapBackendInternship = (
  internship: InternshipApiItem
): Internship => ({
  id: internship._id ?? internship.id ?? "",

  _id: internship._id,

  title: internship.title ?? "",

  companyId:
    typeof internship.companyId === "object"
      ? internship.companyId
      : undefined,

  department:
    internship.skillsRequired?.[0] || "General",

  location: internship.location ?? "",

  type: mapWorkModeToType(internship.workMode),

  stipend: formatStipend(internship.stipend),

  deadline: formatDeadline(internship.deadline),

  duration:
    internship.duration ?? "",

  description:
    internship.description ?? "",

  responsibilities:
    internship.responsibilities ?? [],

  skillsRequired:
    internship.skillsRequired ?? [],

  views:
    internship.views ?? 0,

  status: normalizeStatus(
    internship.status,
    internship.featured
  ),

  featured:
    Boolean(internship.featured),

  createdAt:
    internship.createdAt
      ? new Date(internship.createdAt).toISOString()
      : new Date().toISOString(),
});
const mapFormToBackendInput = (form: InternshipFormState) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  skillsRequired: [form.department.trim() || "General"],
  location: form.location.trim(),
  workMode: mapTypeToWorkMode(form.type),
  stipend: Number(String(form.stipend).replace(/[^0-9.]/g, "")) || 0,
  duration: form.type,
  openings: 1,
  deadline: new Date(`${form.deadline}T23:59:59.000Z`).toISOString(),
});

async function loadRecruiterInternships() {
  const result = await apiGet<RecruiterInternshipResponse>("/api/recruiters/internships?page=1&limit=100");
  return Array.isArray(result.internships) ? result.internships.map(mapBackendInternship) : [];
}

export function useRecruiterInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await apiGet("/api/auth/me");
      setAuthenticated(true);
      const records = await loadRecruiterInternships();
      setInternships(records);
      setEmpty(records.length === 0);
    } catch (err) {
      setAuthenticated(false);
      setInternships([]);
      setEmpty(true);
      setError(err instanceof Error ? err.message : "Failed to load recruiter internships");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  const timer = window.setTimeout(() => {
    void refresh();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [refresh]);

  const stats = useMemo(() => {
    const total = internships.length;
    const active = internships.filter((internship) => internship.status === "Active" || internship.status === "Promoted").length;
    const closed = internships.filter((internship) => internship.status === "Closed").length;

    return [
      { label: "Total Listings", value: total },
      { label: "Active Listings", value: active },
      { label: "Closed Listings", value: closed },
    ];
  }, [internships]);

const createListing = useCallback(async (form: InternshipFormState) => {
    if (!authenticated) {
        throw new Error("Sign in to create internships.");
    }

    await apiPost("/api/internships", mapFormToBackendInput(form));
    await refresh();
}, [authenticated, refresh]);

const updateListing = useCallback(async (id: string, form: InternshipFormState) => {
  if (!authenticated) {
    throw new Error("Sign in to update internships.");
  }

  await apiPatch(`/api/internships/${id}`, mapFormToBackendInput(form));
  await refresh();
}, [authenticated, refresh]);

const promoteListing = useCallback(async (id: string) => {
  if (!authenticated) {
    throw new Error("Sign in to manage internships.");
  }

  const internship = internships.find((item) => item.id === id);
  if (!internship) {
    return;
  }

  await apiPatch(`/api/internships/${id}`, {
    featured: !internship.featured,
  });

  await refresh();
}, [authenticated, internships, refresh]);


const closeListing = useCallback(async (id: string) => {
  if (!authenticated) {
    throw new Error("Sign in to manage internships.");
  }

  await apiPatch(`/api/internships/${id}`, {
    status: "closed",
  });

  await refresh();
}, [authenticated, refresh]);

const reopenListing = useCallback(async (id: string) => {
  if (!authenticated) {
    throw new Error("Sign in to manage internships.");
  }

  const internship = internships.find((item) => item.id === id);

  await apiPatch(`/api/internships/${id}`, {
    status: "active",
    featured: internship?.featured ?? false,
  });

  await refresh();
}, [authenticated, internships, refresh]);

const removeListing = useCallback(async (id: string) => {
  if (!authenticated) {
    throw new Error("Sign in to delete internships.");
  }

  await apiDelete(`/api/internships/${id}`);

  await refresh();
}, [authenticated, refresh]);

const clearListings = useCallback(async () => {
  await Promise.all(
    internships.map((internship) =>
      apiDelete(`/api/internships/${internship.id}`)
    )
  );

  await refresh();
}, [internships, refresh]);
const getInternshipById = useCallback(
  async (id: string) => {
    if (!authenticated) {
      throw new Error("Sign in to view internship.");
    }

const response = await apiGet<{
  data: InternshipApiItem;
}>(`/api/internships/${id}`);

return mapBackendInternship(response.data);
  },
  [authenticated]
);
 return useMemo(
  () => ({
    internships,
    stats,
    emptyForm,
    createListing,
    updateListing,
    promoteListing,
    closeListing,
    reopenListing,
    removeListing,
    clearListings,
    getInternshipById,
    loading,
    error,
    empty,
    authenticated,
    refresh,
  }),
[
  internships,
  stats,
  createListing,
  updateListing,
  promoteListing,
  closeListing,
  reopenListing,
  removeListing,
  clearListings,
  getInternshipById,   // <-- Add here
  loading,
  error,
  empty,
  authenticated,
  refresh,
]
);
}

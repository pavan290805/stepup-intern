"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

export type InternshipStatus = "Draft" | "Active" | "Promoted" | "Closed";

export type Internship = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Hybrid";
  stipend: string;
  deadline: string;
  description: string;
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

type BackendInternship = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  skillsRequired?: string[];
  location?: string;
  workMode?: "remote" | "hybrid" | "onsite";
  stipend?: number;
  duration?: string;
  openings?: number;
  deadline?: string;
  featured?: boolean;
  status?: "draft" | "active" | "closed";
  createdAt?: string;
  companyId?: { name?: string } | string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

type InternshipListResponse = {
  internships?: BackendInternship[];
  pagination?: unknown;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

const listeners = new Set<() => void>();
const stateListeners = new Set<() => void>();
let cachedInternships: Internship[] = [];
let cacheInitialized = false;
let loadPromise: Promise<void> | null = null;
let authPromise: Promise<void> | null = null;

type HookState = {
  loading: boolean;
  error: string | null;
  empty: boolean;
  authenticated: boolean;
  initialized: boolean;
};

let hookState: HookState = {
  loading: true,
  error: null,
  empty: true,
  authenticated: false,
  initialized: false,
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

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const writeCachedInternships = (nextInternships: Internship[]) => {
  cachedInternships = nextInternships;
  cacheInitialized = true;
  hookState = {
    ...hookState,
    empty: nextInternships.length === 0,
  };
  emitChange();
};

const emitStateChange = () => {
  stateListeners.forEach((listener) => listener());
};

const subscribeState = (listener: () => void) => {
  stateListeners.add(listener);

  return () => {
    stateListeners.delete(listener);
  };
};

const setHookState = (nextState: Partial<HookState>) => {
  hookState = {
    ...hookState,
    ...nextState,
  };

  emitStateChange();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const requestJson = async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return (payload?.data ?? (payload as T)) as T;
};

const isAuthError = (error: unknown) => error instanceof Error && /No token provided|Invalid or expired token|Insufficient permissions/i.test(error.message);

const ensureAuthenticated = async () => {
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      await requestJson<unknown>("/api/auth/me", { method: "GET" });
      setHookState({ authenticated: true });
    } catch {
      setHookState({ authenticated: false });
    } finally {
      authPromise = null;
      setHookState({ initialized: true });
    }
  })();

  return authPromise;
};

const mapWorkModeToType = (workMode?: BackendInternship["workMode"]): Internship["type"] => {
  switch (workMode) {
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    case "onsite":
      return "Full-time";
    default:
      return "Full-time";
  }
};

const mapTypeToWorkMode = (type: Internship["type"]): NonNullable<BackendInternship["workMode"]> => {
  switch (type) {
    case "Remote":
      return "remote";
    case "Hybrid":
      return "hybrid";
    case "Part-time":
      return "onsite";
    case "Full-time":
    default:
      return "onsite";
  }
};

const parseStipend = (stipend: string) => {
  const normalized = stipend.replace(/,/g, "");
  const firstNumber = normalized.match(/\d+(?:\.\d+)?/);

  return firstNumber ? Number(firstNumber[0]) : 0;
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

const normalizeStatus = (status?: BackendInternship["status"], featured?: boolean): InternshipStatus => {
  switch (status) {
    case "draft":
      return "Draft";
    case "closed":
      return "Closed";
    case "active":
    default:
      return featured ? "Promoted" : "Active";
  }
};

const mapBackendInternship = (internship: BackendInternship): Internship => ({
  id: internship._id ?? internship.id ?? createId(),
  title: internship.title ?? "",
  department:
    typeof internship.companyId === "object" && internship.companyId && "name" in internship.companyId
      ? internship.companyId.name || "General"
      : "General",
  location: internship.location ?? "",
  type: mapWorkModeToType(internship.workMode),
  stipend: formatStipend(internship.stipend),
  deadline: formatDeadline(internship.deadline),
  description: internship.description ?? "",
  status: normalizeStatus(internship.status, internship.featured),
  featured: Boolean(internship.featured),
  createdAt: internship.createdAt ? new Date(internship.createdAt).toISOString() : new Date().toISOString(),
});

const mapFormToBackendInput = (form: InternshipFormState) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  skillsRequired: [form.department.trim() || "General"],
  location: form.location.trim(),
  workMode: mapTypeToWorkMode(form.type),
  stipend: parseStipend(form.stipend),
  duration: form.type,
  openings: 1,
  deadline: new Date(`${form.deadline}T23:59:59.000Z`).toISOString(),
});

const replaceInternship = (nextInternship: Internship) => {
  writeCachedInternships(getSnapshot().map((internship) => (internship.id === nextInternship.id ? nextInternship : internship)));
};

const loadInternships = async () => {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    setHookState({ loading: true, error: null });

    try {
      const result = await requestJson<InternshipListResponse>("/api/internships?page=1&limit=10", {
        method: "GET",
      });

      const internships = Array.isArray(result.internships) ? result.internships.map(mapBackendInternship) : [];
      writeCachedInternships(internships);
      setHookState({ loading: false, error: null, empty: internships.length === 0 });
    } catch {
      if (!cacheInitialized) {
        writeCachedInternships([]);
      }
      setHookState({ loading: false, empty: cachedInternships.length === 0 });
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
};

const saveBackendInternship = async (id: string, form: InternshipFormState) => {
  const result = await requestJson<BackendInternship>(`/api/internships/${id}`, {
    method: "PATCH",
    body: JSON.stringify(mapFormToBackendInput(form)),
  });

  return mapBackendInternship(result);
};

const createBackendInternship = async (form: InternshipFormState) => {
  const result = await requestJson<BackendInternship>("/api/internships", {
    method: "POST",
    body: JSON.stringify(mapFormToBackendInput(form)),
  });

  return mapBackendInternship(result);
};

const deleteBackendInternship = async (id: string) => {
  await requestJson<null>(`/api/internships/${id}`, {
    method: "DELETE",
  });
};

const getSnapshot = () => {
  if (typeof window === "undefined") {
    return cachedInternships;
  }

  if (!cacheInitialized) {
    cachedInternships = [];
    cacheInitialized = true;
  }

  return cachedInternships;
};

const SERVER_SNAPSHOT: Internship[] = [];
const getServerSnapshot = () => SERVER_SNAPSHOT;

export const useRecruiterInternships = () => {
  const internships = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { loading, error, empty, authenticated } = useSyncExternalStore(subscribeState, () => hookState, () => hookState);

  useEffect(() => {
    void ensureAuthenticated();
    void loadInternships();
  }, []);

  const stats = useMemo(() => {
    const total = internships.length;
    const active = internships.filter((internship) => internship.status === "Active").length;
    const closed = internships.filter((internship) => internship.status === "Closed").length;

    return [
      { label: "Total Listings", value: total },
      { label: "Active Listings", value: active },
      { label: "Closed Listings", value: closed },
    ];
  }, [internships]);


  const createListing = (form: InternshipFormState) => {
    const previousInternships = getSnapshot();
    const temporaryListing: Internship = {
      id: createId(),
      title: form.title.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      type: form.type,
      stipend: form.stipend.trim(),
      deadline: form.deadline,
      description: form.description.trim(),
      status: "Draft",
      featured: false,
      createdAt: new Date().toISOString(),
    };

    writeCachedInternships([temporaryListing, ...previousInternships]);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to create internships." });
        return;
      }

      try {
        const createdListing = await createBackendInternship(form);
        writeCachedInternships([createdListing, ...previousInternships]);
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to create internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to create internship" });
        writeCachedInternships(previousInternships);
      }
    })();

    return temporaryListing;
  };

  const updateListing = (id: string, form: InternshipFormState) => {
    const previousInternships = getSnapshot();
    const nextInternships = previousInternships.map((internship) =>
      internship.id === id
        ? {
            ...internship,
            title: form.title.trim(),
            department: form.department.trim(),
            location: form.location.trim(),
            type: form.type,
            stipend: form.stipend.trim(),
            deadline: form.deadline,
            description: form.description.trim(),
            status: internship.status === "Closed" ? "Draft" : internship.status,
          }
        : internship,
    );

    writeCachedInternships(nextInternships);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to update internships." });
        return;
      }

      try {
        const updatedListing = await saveBackendInternship(id, form);
        writeCachedInternships(
          nextInternships.map((internship) => (internship.id === id ? updatedListing : internship)),
        );
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to update internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to update internship" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  const promoteListing = (id: string) => {
    const previousInternships = getSnapshot();
    const nextInternships: Internship[] = previousInternships.map((internship) => {
      if (internship.id !== id) {
        return internship;
      }

      const featured = !internship.featured;
      const status: InternshipStatus = internship.status === "Closed" ? "Closed" : featured ? "Promoted" : "Active";

      return {
        ...internship,
        featured,
        status,
      };
    });

    writeCachedInternships(nextInternships);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to manage internships." });
        return;
      }

      try {
        const current = previousInternships.find((internship) => internship.id === id);
        if (!current) {
          return;
        }

        const updatedListing = await saveBackendInternship(id, current);
        const nextState: Internship[] = nextInternships.map((internship) =>
          internship.id === id
            ? {
                ...updatedListing,
                featured: internship.featured,
                status: internship.status as InternshipStatus,
              }
            : internship,
        );

        writeCachedInternships(nextState);
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to manage internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to manage internship" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  const closeListing = (id: string) => {
    const previousInternships = getSnapshot();
    const nextInternships: Internship[] = previousInternships.map((internship) =>
      internship.id === id
        ? {
            ...internship,
            status: "Closed",
            featured: false,
          }
        : internship,
    );

    writeCachedInternships(nextInternships);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to manage internships." });
        return;
      }

      try {
        const current = previousInternships.find((internship) => internship.id === id);
        if (!current) {
          return;
        }

        const updatedListing = await saveBackendInternship(id, current);
        const nextState: Internship[] = nextInternships.map((internship) =>
          internship.id === id
            ? {
                ...updatedListing,
                featured: false,
                status: "Closed" as InternshipStatus,
              }
            : internship,
        );

        writeCachedInternships(nextState);
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to manage internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to manage internship" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  const reopenListing = (id: string) => {
    const previousInternships = getSnapshot();
    const nextInternships: Internship[] = previousInternships.map((internship) =>
      internship.id === id
        ? {
            ...internship,
            status: internship.featured ? "Promoted" : "Active",
          }
        : internship,
    );

    writeCachedInternships(nextInternships);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to manage internships." });
        return;
      }

      try {
        const current = previousInternships.find((internship) => internship.id === id);
        if (!current) {
          return;
        }

        const updatedListing = await saveBackendInternship(id, current);
        const nextState: Internship[] = nextInternships.map((internship) =>
          internship.id === id
            ? {
                ...updatedListing,
                featured: internship.featured,
                status: internship.featured ? "Promoted" : "Active",
              }
            : internship,
        );

        writeCachedInternships(nextState);
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to manage internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to manage internship" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  const removeListing = (id: string) => {
    const previousInternships = getSnapshot();
    writeCachedInternships(previousInternships.filter((internship) => internship.id !== id));

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to delete internships." });
        return;
      }

      try {
        await deleteBackendInternship(id);
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to delete internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to delete internship" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  const clearListings = () => {
    const previousInternships = getSnapshot();
    writeCachedInternships([]);

    void (async () => {
      if (!authenticated) {
        setHookState({ error: "Sign in to manage internships." });
        return;
      }

      try {
        await Promise.all(previousInternships.map((internship) => deleteBackendInternship(internship.id)));
        setHookState({ error: null });
      } catch (error) {
        if (isAuthError(error)) {
          setHookState({ authenticated: false, error: "Sign in to manage internships." });
          writeCachedInternships(previousInternships);
          return;
        }

        setHookState({ error: error instanceof Error ? error.message : "Failed to clear internship listings" });
        writeCachedInternships(previousInternships);
      }
    })();
  };

  return {
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
    loading,
    error,
    empty,
  };
};
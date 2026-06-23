"use client";

import { useMemo, useSyncExternalStore } from "react";

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

const STORAGE_KEY = "stepup-internship-listings";

const listeners = new Set<() => void>();
let cachedInternships: Internship[] = [];
let cacheInitialized = false;

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

// Sample internships for demo
const sampleInternships: Internship[] = [
  {
    id: createId(),
    title: "Frontend Developer",
    department: "Computer Science Engg",
    location: "Remote",
    type: "Hybrid",
    stipend: "₹15,000 - ₹20,000",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "We are looking for a talented Frontend Developer to join our team. You will work on building responsive and dynamic web applications using modern JavaScript frameworks.",
    status: "Active",
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

const readStoredInternships = (): Internship[] => {
  if (typeof window === "undefined") {
    return cachedInternships;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    // Initialize with sample data on first load
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleInternships));
    return sampleInternships;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Internship[];
    const storedInternships = Array.isArray(parsedValue) ? parsedValue : [];

    const filteredInternships = storedInternships.filter(
      (internship) =>
        internship.title.trim().toLowerCase() !== "hey" ||
        internship.description.trim().toLowerCase() !== "just do it",
    );

    if (filteredInternships.length !== storedInternships.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInternships));
    }

    return filteredInternships;
  } catch {
    return [];
  }
};

const writeStoredInternships = (nextInternships: Internship[]) => {
  if (typeof window === "undefined") {
    return;
  }

  cachedInternships = nextInternships;
  cacheInitialized = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextInternships));
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => {
  if (typeof window === "undefined") {
    return cachedInternships;
  }

  if (!cacheInitialized) {
    cachedInternships = readStoredInternships();
    cacheInitialized = true;
  }

  return cachedInternships;
};

const SERVER_SNAPSHOT: Internship[] = [];
const getServerSnapshot = () => SERVER_SNAPSHOT;

export const useRecruiterInternships = () => {
  const internships = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
    const currentInternships = getSnapshot();
    const newListing: Internship = {
      id: createId(),
      title: form.title.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      type: form.type,
      stipend: form.stipend.trim(),
      deadline: form.deadline,
      description: form.description.trim(),
      status: "Draft",

    };

    writeStoredInternships([newListing, ...currentInternships]);
    return newListing;
  };

  const updateListing = (id: string, form: InternshipFormState) => {
    writeStoredInternships(
      getSnapshot().map((internship) =>
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
      ),
    );
  };

  const promoteListing = (id: string) => {
    writeStoredInternships(
      getSnapshot().map((internship) => {
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
      }),
    );
  };

  const closeListing = (id: string) => {
    writeStoredInternships(
      getSnapshot().map((internship) =>
        internship.id === id
          ? {
              ...internship,
              status: "Closed",
              featured: false,
            }
          : internship,
      ),
    );
  };

  const reopenListing = (id: string) => {
    writeStoredInternships(
      getSnapshot().map((internship) =>
        internship.id === id
          ? {
              ...internship,
              status: internship.featured ? "Promoted" : "Active",
            }
          : internship,
      ),
    );
  };

  const removeListing = (id: string) => {
    writeStoredInternships(getSnapshot().filter((internship) => internship.id !== id));
  };

  const clearListings = () => {
    writeStoredInternships([]);
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
  };
};
"use client";

import { useEffect, useState } from "react";

export type RecruiterProfile = {
  name: string;
  picture: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  headquarters: string;
  about: string;
  teamSize: number;
  openRoles: number;
  activeListings: number;
  candidatePipeline: number;
  placements: number;
  applicantAlerts: boolean;
  interviewSummaries: boolean;
  marketingDigests: boolean;
  twoFactorEnabled: boolean;
  lastAudit: string;
  keyExpertise: string[];
  experienceHistory: Array<{ title: string; company: string; period: string }>;
};

type BackendRecruiterProfile = {
  _id?: string;
  id?: string;
  userId?: {
    name?: string;
    email?: string;
    profilePicture?: string;
  } | string;
  companyId?: {
    name?: string;
  } | string;
  designation?: string;
  phoneNumber?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

const defaultProfile: RecruiterProfile = {
  name: "Elena Rodriguez",
  picture: "",
  role: "Senior Tech Recruiter",
  company: "StepUp Intern",
  location: "Hyderabad, IN",
  email: "elena.rodriguez@stepup.com",
  phone: "+91 9555 012 345",
  website: "www.stepupintern.com",
  industry: "EdTech / HR Tech",
  headquarters: "Palo Alto, CA",
  about: "Passionate about connecting elite early-career talent with world-class engineering teams. I build hiring strategies for product and engineering teams, matching top talent with fast-growth startups.",
  teamSize: 12,
  openRoles: 8,
  activeListings: 14,
  candidatePipeline: 42,
  placements: 124,
  applicantAlerts: true,
  interviewSummaries: true,
  marketingDigests: false,
  twoFactorEnabled: true,
  lastAudit: "Last audit: 2 hours ago",
  keyExpertise: ["Technical Interviewing", "Talent Strategy", "Diversity & Inclusion"],
  experienceHistory: [
    { title: "Senior Tech Recruiter", company: "StepUp Intern", period: "2021 - Now" },
    { title: "University Recruiter", company: "CloudScale Tech", period: "2018 - 2021" },
  ],
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

const normalizeRecruiterProfile = (profile: BackendRecruiterProfile | null | undefined): RecruiterProfile => {
  if (!profile) {
    return defaultProfile;
  }

  const companyName =
    typeof profile.companyId === "object" && profile.companyId && "name" in profile.companyId
      ? profile.companyId.name || defaultProfile.company
      : defaultProfile.company;

  const name =
    typeof profile.userId === "object" && profile.userId && "name" in profile.userId
      ? profile.userId.name || defaultProfile.name
      : defaultProfile.name;

  const email =
    typeof profile.userId === "object" && profile.userId && "email" in profile.userId
      ? profile.userId.email || defaultProfile.email
      : defaultProfile.email;

  const picture =
    typeof profile.userId === "object" && profile.userId && "profilePicture" in profile.userId
      ? profile.userId.profilePicture || defaultProfile.picture
      : defaultProfile.picture;

  return {
    ...defaultProfile,
    name,
    picture,
    role: profile.designation || defaultProfile.role,
    company: companyName,
    email,
    phone: profile.phoneNumber || defaultProfile.phone,
    lastAudit: profile.updatedAt ? `Last audit: ${new Date(profile.updatedAt).toLocaleString()}` : defaultProfile.lastAudit,
  };
};

const toBackendProfileInput = (profile: RecruiterProfile) => ({
  designation: profile.role.trim(),
  phoneNumber: profile.phone.trim(),
});

const readStoredProfile = async () => {
  const profile = await requestJson<BackendRecruiterProfile | null>("/api/recruiters/profile", {
    method: "GET",
  });

  return normalizeRecruiterProfile(profile);
};

const writeStoredProfile = async (profile: RecruiterProfile) => {
  const updatedProfile = await requestJson<BackendRecruiterProfile>("/api/recruiters/profile", {
    method: "PATCH",
    body: JSON.stringify(toBackendProfileInput(profile)),
  });

  return normalizeRecruiterProfile(updatedProfile);
};

let currentProfile: RecruiterProfile = defaultProfile;
let profileLoaded = false;
let profileLoading = false;
let profileError: string | null = null;
let profileEmpty = true;
const subscribers = new Set<() => void>();

const notifySubscribers = () => {
  subscribers.forEach((listener) => listener());
};

const setProfileState = (nextState: Partial<{ profile: RecruiterProfile; loading: boolean; error: string | null; empty: boolean }>) => {
  if (nextState.profile) {
    currentProfile = nextState.profile;
  }

  if (typeof nextState.loading === "boolean") {
    profileLoading = nextState.loading;
  }

  if (Object.prototype.hasOwnProperty.call(nextState, "error")) {
    profileError = nextState.error ?? null;
  }

  if (typeof nextState.empty === "boolean") {
    profileEmpty = nextState.empty;
  }

  profileLoaded = true;
  notifySubscribers();
};

const refreshProfile = async () => {
  if (profileLoading) {
    return;
  }

  profileLoading = true;
  profileError = null;
  notifySubscribers();

  try {
    const profile = await readStoredProfile();
    setProfileState({ profile, loading: false, error: null, empty: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load recruiter profile";
    setProfileState({ loading: false, error: message, empty: true });
  }
};

const updateProfile = async (nextProfile: RecruiterProfile) => {
  currentProfile = nextProfile;
  profileError = null;
  profileLoading = true;
  notifySubscribers();

  try {
    const savedProfile = await writeStoredProfile(nextProfile);
    setProfileState({ profile: savedProfile, loading: false, error: null, empty: false });
    return savedProfile;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update recruiter profile";
    setProfileState({ loading: false, error: message, empty: profileEmpty });
    throw error;
  }
};

export const useRecruiterProfile = () => {
  const [profile, setProfile] = useState<RecruiterProfile>(currentProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(profileError);
  const [empty, setEmpty] = useState(profileEmpty);

  useEffect(() => {
    const listener = () => {
      setProfile(currentProfile);
      setLoading(profileLoading);
      setError(profileError);
      setEmpty(profileEmpty);
    };

    subscribers.add(listener);

    if (!profileLoaded) {
      void refreshProfile();
    }

    return () => {
      subscribers.delete(listener);
    };
  }, []);

  return { profile, updateProfile, loading, error, empty };
};

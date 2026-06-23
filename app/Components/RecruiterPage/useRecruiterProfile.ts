"use client";

import { useSyncExternalStore } from "react";

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

const STORAGE_KEY = "stepup-recruiter-profile";

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

const readStoredProfile = (): RecruiterProfile => {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProfile;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultProfile;
    }

    return {
      name: typeof parsed.name === "string" ? parsed.name : defaultProfile.name,
      role: typeof parsed.role === "string" ? parsed.role : defaultProfile.role,
      company: typeof parsed.company === "string" ? parsed.company : defaultProfile.company,
      location: typeof parsed.location === "string" ? parsed.location : defaultProfile.location,
      email: typeof parsed.email === "string" ? parsed.email : defaultProfile.email,
      phone: typeof parsed.phone === "string" ? parsed.phone : defaultProfile.phone,
      website: typeof parsed.website === "string" ? parsed.website : defaultProfile.website,
      industry: typeof parsed.industry === "string" ? parsed.industry : defaultProfile.industry,
      headquarters: typeof parsed.headquarters === "string" ? parsed.headquarters : defaultProfile.headquarters,
      about: typeof parsed.about === "string" ? parsed.about : defaultProfile.about,
      teamSize: typeof parsed.teamSize === "number" ? parsed.teamSize : defaultProfile.teamSize,
      openRoles: typeof parsed.openRoles === "number" ? parsed.openRoles : defaultProfile.openRoles,
      activeListings: typeof parsed.activeListings === "number" ? parsed.activeListings : defaultProfile.activeListings,
      picture: typeof parsed.picture === "string" ? parsed.picture : defaultProfile.picture,
      candidatePipeline: typeof parsed.candidatePipeline === "number" ? parsed.candidatePipeline : defaultProfile.candidatePipeline,
      placements: typeof parsed.placements === "number" ? parsed.placements : defaultProfile.placements,
      applicantAlerts: typeof parsed.applicantAlerts === "boolean" ? parsed.applicantAlerts : defaultProfile.applicantAlerts,
      interviewSummaries: typeof parsed.interviewSummaries === "boolean" ? parsed.interviewSummaries : defaultProfile.interviewSummaries,
      marketingDigests: typeof parsed.marketingDigests === "boolean" ? parsed.marketingDigests : defaultProfile.marketingDigests,
      twoFactorEnabled: typeof parsed.twoFactorEnabled === "boolean" ? parsed.twoFactorEnabled : defaultProfile.twoFactorEnabled,
      lastAudit: typeof parsed.lastAudit === "string" ? parsed.lastAudit : defaultProfile.lastAudit,
      keyExpertise: Array.isArray(parsed.keyExpertise) ? parsed.keyExpertise : defaultProfile.keyExpertise,
      experienceHistory: Array.isArray(parsed.experienceHistory) ? parsed.experienceHistory : defaultProfile.experienceHistory,
    };
  } catch {
    return defaultProfile;
  }
};

const writeStoredProfile = (profile: RecruiterProfile) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

let currentProfile: RecruiterProfile = defaultProfile;
const subscribers = new Set<() => void>();

const notifySubscribers = () => {
  subscribers.forEach((listener) => listener());
};

const refreshProfile = () => {
  currentProfile = readStoredProfile();
  notifySubscribers();
};

if (typeof window !== "undefined") {
  currentProfile = readStoredProfile();

  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      refreshProfile();
    }
  });
}

const updateProfile = (nextProfile: RecruiterProfile) => {
  currentProfile = nextProfile;
  writeStoredProfile(nextProfile);
  notifySubscribers();
};

export const useRecruiterProfile = () => {
  const profile = useSyncExternalStore(
    (listener) => {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
    () => currentProfile,
    () => currentProfile,
  );

  return { profile, updateProfile };
};

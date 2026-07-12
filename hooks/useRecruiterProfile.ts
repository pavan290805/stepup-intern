"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecruiterProfile, updateRecruiterProfile, type RecruiterProfileApi } from "@/lib/api";

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

const defaultProfile: RecruiterProfile = {
  name: "Recruiter",
  picture: "",
  role: "Recruiter",
  company: "StepUp Intern",
  location: "Remote",
  email: "recruiter@stepupintern.com",
  phone: "+91 90000 00000",
  website: "https://stepupintern.com",
  industry: "EdTech / HR Tech",
  headquarters: "India",
  about: "Manage openings, review talent, and keep your hiring pipeline moving.",
  teamSize: 1,
  openRoles: 0,
  activeListings: 0,
  candidatePipeline: 0,
  placements: 0,
  applicantAlerts: true,
  interviewSummaries: true,
  marketingDigests: false,
  twoFactorEnabled: true,
  lastAudit: "Last audit: just now",
  keyExpertise: ["Recruitment", "Hiring Operations"],
  experienceHistory: [],
};

const normalizeProfile = (profile: RecruiterProfileApi | null | undefined): RecruiterProfile => {
  if (!profile) {
    return defaultProfile;
  }

  const user =
    typeof profile.userId === "object" && profile.userId
      ? profile.userId
      : undefined;

  const company =
    typeof profile.companyId === "object" && profile.companyId
      ? profile.companyId
      : undefined;

  return {
    ...defaultProfile,
    name: user?.name || defaultProfile.name,
    picture: user?.profilePicture || defaultProfile.picture,
    role: profile.designation || defaultProfile.role,
    company: company?.name || defaultProfile.company,
    email: user?.email || defaultProfile.email,
    phone: profile.phoneNumber || defaultProfile.phone,
    lastAudit: profile.updatedAt ? `Last audit: ${new Date(profile.updatedAt).toLocaleString()}` : defaultProfile.lastAudit,
  };
};

export const useRecruiterProfile = () => {
  const [profile, setProfile] = useState<RecruiterProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getRecruiterProfile();
      const normalized = normalizeProfile(result);
      setProfile(normalized);
      setEmpty(false);
    } catch (err) {
      setProfile(defaultProfile);
      setEmpty(true);
      setError(err instanceof Error ? err.message : "Failed to load recruiter profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (nextProfile: RecruiterProfile) => {
      setProfile(nextProfile);
      setLoading(true);
      try {
        const updated = await updateRecruiterProfile({
          designation: nextProfile.role,
          phoneNumber: nextProfile.phone,
        });
        const normalized = normalizeProfile(updated);
        setProfile(normalized);
        setError(null);
        setEmpty(false);
        return normalized;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update recruiter profile");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { profile, updateProfile, loading, error, empty, refresh };
};

"use client";

import { useEffect, useState } from "react";
import { StudentActivityProvider, useStudentActivityContext } from "../../Components/contexts/StudentActivityContext";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import ATSChecker from "@/components/ATSChecker";
import { INITIAL_PROFILE } from "@/utils/mockData";
import { StudentProfile } from "@/types";
import { getStudentProfile, StudentProfileApi, logout } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MyApplications from "./MyApplications";
import InternshipsAvailable from "./InternshipsAvailable";
import Navbar from "../navbar/Navbar";

function StudentDashboardContent() {
  const [active, setActive] = useState<"profile" | "skill" | "ats" | "applications" | "internships">("profile");
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  
  const [backendProfile, setBackendProfile] = useState<StudentProfileApi | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [realtimeCompletion, setRealtimeCompletion] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  type TabType = "profile" | "skill" | "ats" | "applications" | "internships";

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "skill", "ats", "applications", "internships"].includes(tab)) {
      setActive(tab as TabType);
    }
  }, [searchParams]);

  const { 
    applications, 
    savedInternships, 
    applicationsPagination,
    savedPagination,
    loading, 
    loadMyApplications, 
    loadSavedInternships 
  } = useStudentActivityContext();

  const appliedCount = applicationsPagination?.total ?? applications.length;
  const savedCount = savedPagination?.total ?? savedInternships.length;
  const profileCompletion = backendProfile?.profileCompletion ?? 0;

  useEffect(() => {
    void loadMyApplications();
    void loadSavedInternships();
    
    // Fetch real backend profile to derive workflow state
    async function loadProfile() {
      try {
        const data = await getStudentProfile();
        setBackendProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [loadMyApplications, loadSavedInternships]);

  const handleUpdateResumeText = (text: string) => {
    setProfile((prev) => ({ ...prev, resumeText: text }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} homeRoute="/" title="Student Dashboard" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-[72px]">
        {!loadingProfile && backendProfile && active === "profile" && (
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {backendProfile.profileCompletion < 100 
                  ? "Complete your profile" 
                  : !backendProfile.resumeUrl 
                    ? "Upload your resume" 
                    : "Profile is ready!"}
              </h3>
              <p className="mt-1.5 text-sm text-blue-800">
                {backendProfile.profileCompletion < 100 
                  ? "Get personalized internship recommendations by completing your profile." 
                  : !backendProfile.resumeUrl 
                    ? "Run the ATS Checker by uploading your resume in the Profile tab." 
                    : "Run the ATS Checker or Skill Gap Analyzer to discover your next steps."}
              </p>
            </div>
            <button
              onClick={() => setActive(backendProfile.profileCompletion < 100 || !backendProfile.resumeUrl ? "profile" : "ats")}
              className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              {backendProfile.profileCompletion < 100 
                  ? "Go to Profile" 
                  : !backendProfile.resumeUrl 
                    ? "Upload Resume" 
                    : "Run ATS Checker"}
            </button>
          </div>
        )}

        {/* Profile Snapshot - Only show on Profile tab */}
        {active === "profile" && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Applied */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Internships Applied</p>
                <svg className="h-5 w-5 text-[#0880EF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : appliedCount}</p>
            </div>

            {/* Saved */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Saved Internships</p>
                <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : savedCount}</p>
            </div>

            {/* Profile Completion */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Profile Completion</p>
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-3xl font-bold text-slate-900 w-16">{loadingProfile ? "..." : `${realtimeCompletion ?? profileCompletion}%`}</p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${loadingProfile ? 0 : (realtimeCompletion ?? profileCompletion)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <main>
          {active === "profile" && <ProfileManagement onProgressUpdate={setRealtimeCompletion} />}
          {active === "applications" && <MyApplications />}
          {active === "internships" && <InternshipsAvailable />}
          {active === "skill" && <SkillGapAnalyzer />}
          {active === "ats" && (
            <ATSChecker
              profile={profile}
              onUpdateResumeText={handleUpdateResumeText}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <StudentActivityProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading dashboard...</div>}>
        <StudentDashboardContent />
      </Suspense>
    </StudentActivityProvider>
  );
}
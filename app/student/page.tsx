"use client";

import { useEffect, useState } from "react";
import { StudentActivityProvider, useStudentActivityContext } from "../../Components/contexts/StudentActivityContext";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import ATSChecker from "@/components/ATSChecker";
import AIAssistant from "@/components/AIAssistant";
import { INITIAL_PROFILE, INITIAL_CHAT } from "@/utils/mockData";
import { StudentProfile, ChatMessage } from "@/types";
import { getStudentProfile, StudentProfileApi, logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import MyApplications from "./MyApplications";
import InternshipsAvailable from "./InternshipsAvailable";

function StudentDashboardContent() {
  const [active, setActive] = useState<"profile" | "skill" | "ats" | "ai" | "applications" | "internships">("profile");
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  
  const [backendProfile, setBackendProfile] = useState<StudentProfileApi | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

  const { applications, savedInternships, loading, error, loadMyApplications, loadSavedInternships } = useStudentActivityContext();

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

  const handleSendMessage = (newMessages: ChatMessage[]) => {
    setChatMessages(newMessages);
  };

  const handleClearChatHistory = () => {
    setChatMessages([]);
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
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-blue-600">StepUp</span>
              <span className="text-xl font-bold tracking-tight text-slate-900">Intern</span>
            </div>
            
            <div className="hidden lg:flex lg:gap-x-1 lg:items-center">
              {[
                { id: "profile", label: "Profile" },
                { id: "applications", label: "My Applications" },
                { id: "internships", label: "Available Internships" },
                { id: "skill", label: "Skill Gap Analyzer" },
                { id: "ats", label: "ATS Checker" },
                { id: "ai", label: "AI Assistant" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id as any)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row (Horizontal Scroll) */}
        <div className="flex lg:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 hide-scrollbar">
           <div className="flex gap-2">
              {[
                { id: "profile", label: "Profile" },
                { id: "applications", label: "My Applications" },
                { id: "internships", label: "Available Internships" },
                { id: "skill", label: "Skill Gap Analyzer" },
                { id: "ats", label: "ATS Checker" },
                { id: "ai", label: "AI Assistant" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id as any)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Log out
              </button>
           </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

        <main>
          {active === "profile" && <ProfileManagement />}
          {active === "applications" && <MyApplications />}
          {active === "internships" && <InternshipsAvailable />}
          {active === "skill" && <SkillGapAnalyzer />}
          {active === "ats" && (
            <ATSChecker
              profile={profile}
              onUpdateResumeText={handleUpdateResumeText}
            />
          )}
          {active === "ai" && (
            <AIAssistant
              profile={profile}
              initialChatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChatHistory={handleClearChatHistory}
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
      <StudentDashboardContent />
    </StudentActivityProvider>
  );
}
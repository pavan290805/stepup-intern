"use client";

import { useEffect, useState } from "react";
import { StudentActivityProvider, useStudentActivityContext } from "../../Components/contexts/StudentActivityContext";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import ATSChecker from "@/components/ATSChecker";
import AIAssistant from "@/components/AIAssistant";
import { INITIAL_PROFILE, INITIAL_CHAT } from "@/utils/mockData";
import { StudentProfile, ChatMessage } from "@/types";

function StudentDashboardContent() {
  const [active, setActive] = useState<"profile" | "skill" | "ats" | "ai">("profile");
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  
  const { applications, savedInternships, loading, error, loadMyApplications, loadSavedInternships } = useStudentActivityContext();

  useEffect(() => {
    void loadMyApplications();
    void loadSavedInternships();
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="mx-4 mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">My Applications</h3>
            {loading ? <span className="text-sm text-slate-500">Loading…</span> : null}
          </div>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {!loading && applications.length === 0 && !error ? (
            <p className="mt-3 text-sm text-slate-500">You have no applications yet.</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {applications.map((application) => (
              <div key={application._id} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="font-medium text-slate-900">{typeof application.internshipId === "object" && application.internshipId ? application.internshipId.title : "Internship"}</p>
                <p className="text-sm text-slate-500">Status: {application.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Saved Internships</h3>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {!loading && savedInternships.length === 0 && !error ? (
            <p className="mt-3 text-sm text-slate-500">You have no saved internships.</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {savedInternships.map((item, index) => (
              <div key={item._id ?? `${item.internshipId}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="font-medium text-slate-900">
                  {typeof item.internshipId === "object" && item.internshipId && "title" in item.internshipId ? item.internshipId.title : "Saved internship"}
                </p>
                <p className="text-sm text-slate-500">Saved for later</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActive("profile")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
            active === "profile"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Profile Management
        </button>

        <button
          onClick={() => setActive("skill")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
            active === "skill"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Skill Gap Analyzer
        </button>

        <button
          onClick={() => setActive("ats")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
            active === "ats"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          ATS Checker
        </button>

        <button
          onClick={() => setActive("ai")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
            active === "ai"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          AI Assistant
        </button>
      </div>

      <div>
        {active === "profile" && <ProfileManagement />}
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
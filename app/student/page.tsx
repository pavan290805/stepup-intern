"use client";

import { useState } from "react";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import ATSChecker from "@/components/ATSChecker";
import AIAssistant from "@/components/AIAssistant";
import { INITIAL_PROFILE, INITIAL_CHAT } from "@/utils/mockData";
import { StudentProfile, ChatMessage } from "@/types";

export default function StudentDashboard() {
  const [active, setActive] = useState<"profile" | "skill" | "ats" | "ai">("profile");
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

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
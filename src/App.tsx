import React, { useState } from "react";
import { 
  Home, FileCheck, BrainCircuit, TrendingUp, Briefcase, User, 
  Search, Bell, Settings, LogOut, Sparkles, Plus, Check, MessageSquare
} from "lucide-react";

// Components
import HomeView from "./components/HomeView";
import ATSChecker from "./components/ATSChecker";
import AIAssistant from "./components/AIAssistant";
import SkillGap from "./components/SkillGap";
import Applications from "./components/Applications";
import Profile from "./components/Profile";

// Mock Aggregates
import { INITIAL_PROFILE, INITIAL_APPLICATIONS, INITIAL_CHAT } from "./utils/mockData";
import { StudentProfile, JobApplication, ChatMessage, CuratorJob, ApplicationStage } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("ATS Checker");
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  // Search input and interactive indicators
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Passed Google Workspace intern candidate review!",
    "ATS Checker: Score of 85% recommended for backend roles.",
    "Schedule notice: Spotify phone round tomorrow at 10 AM.",
    "AI Career Buddy suggested React hooks checklist."
  ]);

  // Handler: Switches tabs and seeds AI Chat instantly on clicking Home prompts
  const handleQuickChatPrompt = (promptText: string) => {
    const newUserMessage: ChatMessage = {
      id: "usr-quick-" + Date.now(),
      role: "user",
      content: promptText,
      timestamp: new Date().toISOString()
    };
    
    // Append and trigger active tab change
    setChatMessages((prev) => [...prev, newUserMessage]);
    setActiveTab("AI Assistant");
  };

  // Handler: Saved Chat lists back from AIAssistant
  const handleSaveChatHistory = (messages: ChatMessage[]) => {
    setChatMessages(messages);
  };

  const handleClearChatHistory = () => {
    setChatMessages([]);
  };

  // Handler: Adds tracked application from curated list
  const handleAddApplicationFromSelector = (job: CuratorJob) => {
    // Check if duplicate
    const exists = applications.find(
      (app) => app.company.toLowerCase() === job.company.toLowerCase() && app.role.toLowerCase() === job.title.toLowerCase()
    );
    if (exists) return;

    const newApp: JobApplication = {
      id: "app-sel-" + Date.now(),
      company: job.company,
      role: job.title,
      location: job.location,
      salary: job.salary,
      stage: "Applied",
      dateApplied: new Date().toISOString().split("T")[0],
      notes: "Auto-added from recommended jobs curator board."
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  // Handler: Adds a completely custom application from the Application sub-form
  const handleAddCustomApplication = (rawApp: Omit<JobApplication, "id">) => {
    const newApp: JobApplication = {
      id: "app-cust-" + Date.now(),
      ...rawApp
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  // Handler: Update applications stages dropdown
  const handleUpdateApplicationStage = (id: string, stage: ApplicationStage) => {
    setApplications((prev) => 
      prev.map((app) => app.id === id ? { ...app, stage } : app)
    );
  };

  // Handler: Delete logged application
  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Handler: Sync complete user profile changes
  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
  };

  const handleUpdateResumeText = (newText: string) => {
    setProfile((prev) => ({
      ...prev,
      resumeText: newText
    }));
  };

  // Left sidebar Navigation Options List
  const NAVIGATION_ITEMS = [
    { id: "ATS Checker", label: "ATS Checker", icon: FileCheck },
    { id: "AI Assistant", label: "AI Assistant", icon: BrainCircuit }
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] text-slate-700 antialiased font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION NAVIGATION MODULE */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
        
        {/* Upper Brand / Logo Block */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            {/* Visual Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-550 to-blue-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-800 text-base leading-tight tracking-tight">StepUp</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5">Student Portal</p>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1 my-8">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition text-xs font-bold ${
                    isActive 
                      ? "bg-brand-50 text-brand-550 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/70"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-brand-550" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower user footer in navbar */}
        <div className="p-5 border-t border-slate-50 flex items-center gap-3.5 bg-slate-50/40">
          <div className="relative">
            <img 
              src={profile.personalInfo.avatar} 
              alt={profile.personalInfo.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            {profile.personalInfo.premiumStatus && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black border border-white" title="Premium plan">
                ★
              </span>
            )}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <h4 className="text-xs font-extrabold text-slate-800 truncate leading-tight">
              {profile.personalInfo.name}
            </h4>
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-brand-550 font-mono leading-none">
              PREMIUM PLAN
            </p>
          </div>
        </div>

      </aside>

      {/* 2. RIGHT MASTER CANVAS PAGE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* UPPER PLUG IN HEAD NAVIGATION UTILITY BLOCK */}
        <header className="bg-white border-b border-slate-100 h-16 px-6 sticky top-0 flex items-center justify-between z-30 shadow-xs/10">
          
          {/* Mobile responsive search bar / tab heading */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile logo trigger */}
            <div className="md:hidden flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-7 h-7 bg-brand-550 text-white rounded-lg flex items-center justify-center font-black text-sm">S</span>
              <span className="text-sm">StepUp</span>
            </div>

            {/* General search tool */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 rounded-xl px-3.5 py-1.5 w-80 max-w-full">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search internships, skills, or mentors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 ring-0 outline-none text-xs text-slate-700 w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Tools: notification alert, setting gear details, avatar */}
          <div className="flex items-center gap-4">
            
            {/* Notification triggers bell badge */}
            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100/50 relative transition cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                )}
              </button>

              {/* Notification drop menu list */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 space-y-3 z-50 text-xs">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-50">
                    <span className="font-bold text-slate-800">Alert Center</span>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-brand-550 hover:underline font-semibold"
                    >
                      Dismiss of all
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-2">No new alerts found!</p>
                    ) : (
                      notifications.map((notif, index) => (
                        <div key={index} className="p-2 bg-slate-55 text-slate-700 rounded-lg hover:bg-blue-50/50 transition">
                          &bull; {notif}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick action button that redirects to profile helper */}
            <button 
              onClick={() => setActiveTab("Profile")}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100/50 transition cursor-pointer"
              title="Global settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>

            {/* Small portrait image trigger */}
            <div className="h-8 w-px bg-slate-100"></div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("Profile")}>
              <img 
                src={profile.personalInfo.avatar} 
                alt="Profile photo" 
                className="h-8.5 w-8.5 rounded-lg object-cover border border-slate-200" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </header>

        {/* MOBILE NAVIGATION BAR TRIGGER FOR TABLETS/PHONES */}
        <div className="md:hidden bg-white border-b border-slate-150 px-4 py-2 flex items-center gap-1.5 overflow-x-auto overflow-y-hidden select-none whitespace-nowrap">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === item.id 
                  ? "bg-brand-550 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 border border-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 3. MAIN TAB CONTENT AREA WINDOW */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-16">
          
          <div className="bg-glow-spot absolute pointer-events-none inset-0 z-0"></div>

          <div className="relative z-10">
            {activeTab === "Home" && (
              <HomeView 
                profile={profile}
                applications={applications}
                onNavigate={(tab) => setActiveTab(tab)}
                onQuickChatPrompt={handleQuickChatPrompt}
                onAddApplicationFromSelector={handleAddApplicationFromSelector}
              />
            )}

            {activeTab === "ATS Checker" && (
              <ATSChecker 
                profile={profile}
                onUpdateResumeText={handleUpdateResumeText}
              />
            )}

            {activeTab === "AI Assistant" && (
              <AIAssistant 
                profile={profile}
                initialChatMessages={chatMessages}
                onSendMessage={handleSaveChatHistory}
                onClearChatHistory={handleClearChatHistory}
              />
            )}

            {activeTab === "Skill Gap" && (
              <SkillGap 
                profile={profile}
              />
            )}

            {activeTab === "Applications" && (
              <Applications 
                applications={applications}
                onAddApplication={handleAddCustomApplication}
                onUpdateStage={handleUpdateApplicationStage}
                onDeleteApplication={handleDeleteApplication}
              />
            )}

            {activeTab === "Profile" && (
              <Profile 
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>

        </main>

      </div>

    </div>
  );
}

import React, { useState } from "react";
import { 
  FileText, CheckCircle, AlertCircle, Sparkles, 
  MapPin, Clock, DollarSign, Award, FolderGit2, Users, 
  TrendingUp, ArrowRight, ChevronRight, Briefcase, ExternalLink, Plus
} from "lucide-react";
import { StudentProfile, JobApplication, CuratorJob } from "../types";
import { CURATED_JOB_BOARD } from "../utils/mockData";

interface HomeViewProps {
  profile: StudentProfile;
  applications: JobApplication[];
  onNavigate: (tab: string) => void;
  onQuickChatPrompt: (prompt: string) => void;
  onAddApplicationFromSelector: (job: CuratorJob) => void;
}

export default function HomeView({ 
  profile, 
  applications, 
  onNavigate, 
  onQuickChatPrompt,
  onAddApplicationFromSelector
}: HomeViewProps) {
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  // Group applications by status for journey indicators
  const getStageCount = (stage: string) => {
    return applications.filter(app => app.stage === stage).length;
  };

  const handleApplyClick = (job: CuratorJob, e: React.MouseEvent) => {
    e.preventDefault();
    onAddApplicationFromSelector(job);
    setCopiedJobId(job.id);
    setTimeout(() => setCopiedJobId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div id="home-welcome-banner" className="relative overflow-hidden bg-brand-550 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-blue-500 opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-40 h-40 rounded-full bg-blue-300 opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good evening, {profile.personalInfo.name.split(" ")[0]}! Ready to level up your career?
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              You've completed <span className="font-semibold text-white">85%</span> of your profile. A complete profile gets <span className="font-semibold text-white">3x more views</span> and smarter AI recommendations.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("Profile")}
            id="btn-complete-profile"
            className="self-start md:self-auto bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition hover:bg-blue-50 shadow-sm cursor-pointer whitespace-nowrap"
          >
            Complete Profile
          </button>
        </div>
      </div>

      {/* 2. Application Journey Track Selector */}
      <div id="app-journey-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">Application Journey</h2>
          <button 
            onClick={() => onNavigate("Applications")} 
            className="text-xs font-semibold text-brand-550 flex items-center gap-1 hover:underline cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Stages Grid Timeline */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
          <div className="absolute hidden md:block top-1/2 left-8 right-8 h-0.5 bg-slate-100 -translate-y-12 z-0"></div>

          {/* Stage 1: Applied */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-10 h-10 rounded-full bg-brand-550 text-white flex items-center justify-center font-bold text-sm shadow-md transition transform hover:scale-115 cursor-pointer" onClick={() => onNavigate("Applications")}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <p className="text-xs font-bold text-slate-800">Applied</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{getStageCount("Applied")} Active</p>
            </div>
          </div>

          {/* Stage 2: Under Review */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-550 border border-brand-200 flex items-center justify-center font-bold text-sm shadow-sm transition transform hover:scale-115 cursor-pointer" onClick={() => onNavigate("Applications")}>
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <p className="text-xs font-bold text-slate-800">Under Review</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{getStageCount("Under Review")} Active</p>
            </div>
          </div>

          {/* Stage 3: Shortlisted */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-550 border border-brand-200 flex items-center justify-center font-bold text-sm shadow-sm transition transform hover:scale-115 cursor-pointer" onClick={() => onNavigate("Applications")}>
              <Award className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <p className="text-xs font-bold text-slate-800">Shortlisted</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{getStageCount("Shortlisted")} Active</p>
            </div>
          </div>

          {/* Stage 4: Interview */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-550 border border-brand-200 flex items-center justify-center font-bold text-sm shadow-sm transition transform hover:scale-115 cursor-pointer" onClick={() => onNavigate("Applications")}>
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <p className="text-xs font-bold text-slate-800">Interview</p>
              <p className="text-[11px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] uppercase mt-1">
                {getStageCount("Interview Scheduled") > 0 ? "Scheduled" : "Final Stage"}
              </p>
            </div>
          </div>

          {/* Stage 5: Selected */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-550 border border-brand-200 flex items-center justify-center font-bold text-sm shadow-sm transition transform hover:scale-115 cursor-pointer" onClick={() => onNavigate("Applications")}>
              <Users className="w-5 h-5" />
            </div>
            <div className="mt-2.5">
              <p className="text-xs font-bold text-slate-800">Selected</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{getStageCount("Selected")} Hires</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Dashboard Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: ATS Checker widget */}
        <div id="home-ats-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">ATS Checker</h3>
              <FileText className="w-5 h-5 text-brand-550" />
            </div>

            {/* Circular Donut Widget exactly as reference design */}
            <div className="flex justify-center my-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Radial percentage */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#e2effe" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#0263e6" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) * (1 - 0.75)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-extrabold text-slate-800 leading-none">75%</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">Score</p>
                </div>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2 mt-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Keyword Analysis matched (60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Formatting Optimization validated</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="text-slate-500">Missing Industry Keywords (Next.js)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("ATS Checker")}
            id="btn-home-ats-analyze"
            className="w-full bg-brand-550 text-white font-semibold py-2.5 rounded-xl text-xs mt-6 transition hover:bg-blue-600 cursor-pointer shadow-sm active:translate-y-px"
          >
            Analyze Now
          </button>
        </div>

        {/* Card 2: AI Career Buddy */}
        <div id="home-ai-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">AI Career Buddy</h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-brand-550">Beta</span>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>

            {/* Sample Chat Message */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 relative mb-4 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-550 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  AI
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Hey Sangu! I noticed you haven't updated your skills in a while. Should we audit your latest projects?
                </p>
              </div>
            </div>

            {/* Selectable Quick-Response bubble */}
            <button
              onClick={() => onQuickChatPrompt("Yes, let's analyze my Mern Stack projects")}
              className="w-full text-left bg-brand-550 text-white hover:bg-blue-600 text-xs px-3.5 py-2.5 rounded-xl transition font-medium flex items-center justify-between shadow-sm cursor-pointer"
            >
              <span>Yes, let's analyze my "Mern Stack"</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Career advisory quick blocks */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => onQuickChatPrompt("Give me Career Guidance regarding software role roadmaps")}
                className="bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-100 rounded-xl p-2.5 text-left transition cursor-pointer"
              >
                <p className="text-xs font-bold text-brand-550 leading-tight">Career Guidance</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Roadmaps & Roles</p>
              </button>
              <button 
                onClick={() => onQuickChatPrompt("Can you give me Resume Advice bullet points tips?")}
                className="bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-100 rounded-xl p-2.5 text-left transition cursor-pointer"
              >
                <p className="text-xs font-bold text-brand-550 leading-tight">Resume Advice</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Bullet point tips</p>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Combined Highlights & Skills Side View */}
        <div className="space-y-6">
          {/* Highlights Info */}
          <div id="home-highlights-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-4 font-mono">My Highlights</p>
              <div className="space-y-3">
                <div onClick={() => onNavigate("Profile")} className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 p-2.5 rounded-xl cursor-pointer transition border border-transparent hover:border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-brand-550 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Certifications</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{profile.certifications.length}</span>
                </div>

                <div onClick={() => onNavigate("Profile")} className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 p-2.5 rounded-xl cursor-pointer transition border border-transparent hover:border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-brand-550 flex items-center justify-center">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Projects</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{profile.projects.length}</span>
                </div>

                <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-xl border border-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-brand-550 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Mentors</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">2</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("Profile")}
              className="text-center text-xs font-bold text-brand-550 hover:underline mt-4 cursor-pointer self-center"
            >
              Manage Profile
            </button>
          </div>

          {/* Skill Gaps Mini List */}
          <div id="home-skill-gaps-card" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-wider uppercase font-bold text-slate-400 font-mono">Skill Gaps</p>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">React.js</span>
                  <span className="font-bold text-brand-550">90%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-550 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">TypeScript</span>
                  <span className="font-bold text-brand-550">45%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate("Skill Gap")}
              className="w-full border border-slate-200 hover:border-brand-550 text-slate-600 hover:text-brand-550 font-semibold py-2 rounded-xl text-xs mt-5 transition text-center block bg-white cursor-pointer"
            >
              View Roadmap
            </button>
          </div>
        </div>

      </div>

      {/* 4. Curated Job Board Widget with Instant Apply tracker */}
      <div id="home-job-board" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight text-slate-800">Recommended for You</h2>
            <p className="text-xs text-slate-500">Curated opportunities matching your student portfolio and tech skills</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Slide matches</span>
            {/* Minimal decorator badges */}
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-550"></span>
              <span className="w-2 h-2 rounded-full bg-slate-200"></span>
              <span className="w-2 h-2 rounded-full bg-slate-200"></span>
            </div>
          </div>
        </div>

        {/* Responsive Grid or Card list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURATED_JOB_BOARD.slice(0, 3).map((job) => (
            <div 
              key={job.id} 
              className="bg-slate-50/50 hover:bg-white rounded-2xl p-5 border border-slate-100 transition duration-200 hover:shadow-md flex flex-col justify-between group relative"
            >
              {job.isNew && (
                <span className="absolute top-4 right-4 bg-blue-100 text-brand-550 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                  New
                </span>
              )}
              
              <div className="space-y-4">
                {/* Logo and metadata */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-1.5 ${job.bgLogo || "bg-blue-100"}`}>
                    <img 
                      src={job.logoUrl} 
                      alt={job.company} 
                      className="w-full h-full object-cover rounded-md" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-brand-550 transition line-clamp-1">
                      {job.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {job.company} &bull; {job.location}
                    </p>
                  </div>
                </div>

                {/* Tags block */}
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-4">
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {job.salary}
                </span>
                
                <button
                  onClick={(e) => handleApplyClick(job, e)}
                  className={`text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                    copiedJobId === job.id 
                      ? "text-emerald-500" 
                      : "text-brand-550 underline hover:no-underline"
                  }`}
                >
                  {copiedJobId === job.id ? (
                    <span className="flex items-center gap-1">Added &bull; Tracked!</span>
                  ) : (
                    <span className="flex items-center gap-0.5">Apply Now <ExternalLink className="w-3 h-3" /></span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

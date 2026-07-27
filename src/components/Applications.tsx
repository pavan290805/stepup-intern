import React, { useState } from "react";
import { 
  Briefcase, Plus, Calendar, MapPin, DollarSign, ExternalLink, 
  Trash2, ClipboardList, TrendingUp, Sparkles, Filter, ChevronDown, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JobApplication, ApplicationStage } from "../types";

interface ApplicationsProps {
  applications: JobApplication[];
  onAddApplication: (newApp: Omit<JobApplication, "id">) => void;
  onUpdateStage: (id: string, stage: ApplicationStage) => void;
  onDeleteApplication: (id: string) => void;
}

export default function Applications({ 
  applications, 
  onAddApplication, 
  onUpdateStage, 
  onDeleteApplication 
}: ApplicationsProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [stageFilter, setStageFilter] = useState<string>("All");

  // Form Fields State
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [stage, setStage] = useState<ApplicationStage>("Applied");
  const [dateApplied, setDateApplied] = useState<string>(new Date().toISOString().split("T")[0]);
  const [link, setLink] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAddApplication({
      company,
      role,
      location: location || "Remote",
      salary: salary || "N/A",
      stage,
      dateApplied,
      link,
      notes
    });

    // Reset Form Fields
    setCompany("");
    setRole("");
    setLocation("");
    setSalary("");
    setStage("Applied");
    setDateApplied(new Date().toISOString().split("T")[0]);
    setLink("");
    setNotes("");
    setShowAddForm(false);
  };

  const getStageColorBadge = (stg: ApplicationStage) => {
    switch (stg) {
      case "Applied":
        return "bg-blue-550/10 text-brand-550";
      case "Under Review":
        return "bg-amber-100/70 text-amber-600";
      case "Shortlisted":
        return "bg-purple-100 text-purple-700";
      case "Interview Scheduled":
        return "bg-sky-100 text-sky-700";
      case "Selected":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filter listings
  const filteredApps = stageFilter === "All" 
    ? applications 
    : applications.filter(app => app.stage === stageFilter);

  // Stats Counters
  const totalCount = applications.length;
  const activeCount = applications.filter(app => app.stage !== "Rejected" && app.stage !== "Selected").length;
  const hireCount = applications.filter(app => app.stage === "Selected").length;

  return (
    <div className="space-y-6">
      {/* 1. Header summary with add buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-550" /> Application Management
          </h1>
          <p className="text-xs text-slate-500">Track milestones, interview dates, and recruitment stages across all candidate applications.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          id="btn-add-application-toggle"
          className="bg-brand-550 hover:bg-blue-600 active:translate-y-px text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-white" /> Add Opportunity
        </button>
      </div>

      {/* 2. Visual summary stats charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Applications</p>
            <p className="text-2xl font-black text-slate-800 font-mono mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-550 flex items-center justify-center font-bold">
            All
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Funnel</p>
            <p className="text-2xl font-black text-slate-800 font-mono mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            Live
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Offers Selected</p>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-1">{hireCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
            Hires
          </div>
        </div>
      </div>

      {/* 3. Dropdown Expandable Add Form Modal-Like Card */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleSubmit} 
              id="add-application-form"
              className="bg-white rounded-2xl border-2 border-brand-100 p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Add New Career Application Record</h3>
                <span className="text-[10px] text-brand-550 font-bold bg-brand-50 px-2 py-0.5 rounded uppercase">Track Mode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Company Name *</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Apple"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-medium"
                  />
                </div>

                {/* Role Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Role position *</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Intern, Associate"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-medium"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Location office</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Stanford, Remote"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-medium"
                  />
                </div>

                {/* Salary Package representation */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Salary Compensation</label>
                  <input 
                    type="text" 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $45 / hr, $120k / yr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Status Stage dropdown selector */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Funnel Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ApplicationStage)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-semibold"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Date Applied</label>
                  <input 
                    type="date" 
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-semibold"
                  />
                </div>

                {/* Listing Portfolio external link */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-slate-700">List Details URL</label>
                  <input 
                    type="url" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g. https://google.com/careers/marketing-job"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Personal Notes context */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Advisory Logging Notes / Interview Schedule dates</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record credentials used, hiring manager replies, technical challenge links, or mock patterns..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 resize-none font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-new-application"
                  className="bg-brand-550 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
                >
                  Save Record
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Controls: Stage Filter bar selector */}
      <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-600">Filters:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar max-w-full pb-1 sm:pb-0">
          {["All", "Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"].map((opt) => (
            <button
              key={opt}
              onClick={() => setStageFilter(opt)}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                stageFilter === opt 
                  ? "bg-brand-550 text-white shadow-sm" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Job Applications list table */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 max-w-full shadow-sm">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-600 text-xs">No matching application records detected</h3>
            <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">Change your filter selectors or click the top Add button to create a new tracking card!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-brand-200 transition relative"
              >
                {/* Upper line: company, job, and stages pill dropdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-sm">{app.role}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500 font-semibold">{app.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-300" /> {app.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-300" /> {app.salary}</span>
                    </div>
                  </div>

                  {/* Right side Stage Selector Controls */}
                  <div className="flex items-center gap-2.5">
                    <select
                      value={app.stage}
                      onChange={(e) => onUpdateStage(app.id, e.target.value as ApplicationStage)}
                      className={`text-[11px] font-extrabold pr-8 pl-3 py-1.5 rounded-xl border border-transparent focus:ring-1 focus:ring-brand-550 outline-none cursor-pointer leading-tight font-semibold ${getStageColorBadge(app.stage)}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step horizontal visually detailed tracker */}
                <div className="hidden sm:block pt-1 pb-2">
                  <div className="flex justify-between relative mt-4">
                    {/* Background joining line */}
                    <div className="absolute top-2 left-6 right-6 h-0.5 bg-slate-100 z-0"></div>
                    
                    {/* Colored filled progress overlay */}
                    <div 
                      className="absolute top-2 left-6 h-0.5 bg-brand-550 z-0 transition-all duration-300"
                      style={{
                        width: app.stage === "Applied" ? "0%" 
                        : app.stage === "Under Review" ? "25%" 
                        : app.stage === "Shortlisted" ? "50%" 
                        : app.stage === "Interview Scheduled" ? "75%" 
                        : "100%"
                      }}
                    ></div>

                    {["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected"].map((stgLabel) => {
                      const stagesList: ApplicationStage[] = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];
                      const currentIdx = stagesList.indexOf(app.stage);
                      const targetIdx = stagesList.indexOf(stgLabel as ApplicationStage);
                      const isCompleted = currentIdx >= targetIdx && app.stage !== "Rejected";
                      const isCurrent = app.stage === stgLabel;

                      return (
                        <div key={stgLabel} className="flex flex-col items-center text-center z-10 w-24">
                          <div 
                            className={`w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center font-bold text-[8px] ${
                              isCompleted 
                                ? "bg-brand-550 border-brand-550 text-white" 
                                : isCurrent && app.stage === "Rejected"
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            {isCompleted && "✓"}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 block leading-tight ${
                            isCurrent 
                              ? "text-brand-550 font-extrabold" 
                              : "text-slate-400"
                          }`}>
                            {stgLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary notes log */}
                {app.notes && (
                  <p className="text-xs bg-slate-50 text-slate-600 rounded-xl p-3 border border-slate-100 font-mono">
                    <strong>Logged Log &bull; Notes:</strong> {app.notes}
                  </p>
                )}

                {/* Secondary detail line: date and external portfolio link */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date Applied: <strong className="text-slate-600 font-mono">{app.dateApplied}</strong>
                  </span>

                  {app.link && (
                    <a 
                      href={app.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-brand-550 font-bold hover:underline flex items-center gap-0.5"
                    >
                      Direct Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

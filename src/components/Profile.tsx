import React, { useState } from "react";
import { 
  User, GraduationCap, Briefcase, Award, FolderGit2, Link2, 
  Trash2, Plus, CheckCircle, Save, Globe, Linkedin, Github, 
  Sparkles, ListPlus
} from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile, Education, WorkExperience, Project, Certification, Achievement, PersonalInfo } from "../types";

interface ProfileProps {
  profile: StudentProfile;
  onUpdateProfile: (updatedProfile: StudentProfile) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("Personal");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Skills input helper
  const [newSkill, setNewSkill] = useState<string>("");

  // Sub-forms states for adding lists
  const [eduSchool, setEduSchool] = useState<string>("");
  const [eduDegree, setEduDegree] = useState<string>("");
  const [eduField, setEduField] = useState<string>("");
  const [eduDuration, setEduDuration] = useState<string>("");
  const [eduGPA, setEduGPA] = useState<string>("");

  const [expRole, setExpRole] = useState<string>("");
  const [expCompany, setExpCompany] = useState<string>("");
  const [expDuration, setExpDuration] = useState<string>("");
  const [expDescription, setExpDescription] = useState<string>("");

  const [projTitle, setProjTitle] = useState<string>("");
  const [projDesc, setProjDesc] = useState<string>("");
  const [projTech, setProjTech] = useState<string>("");
  const [projLink, setProjLink] = useState<string>("");
  const [projDate, setProjDate] = useState<string>("");

  const [certName, setCertName] = useState<string>("");
  const [certIssuer, setCertIssuer] = useState<string>("");
  const [certDate, setCertDate] = useState<string>("");
  const [certID, setCertID] = useState<string>("");

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePersonalChange = (key: keyof PersonalInfo, val: string) => {
    const updated = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        [key]: val
      }
    };
    onUpdateProfile(updated);
  };

  // Skill updates
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.skills.map(s => s.toLowerCase()).includes(newSkill.trim().toLowerCase())) {
      setNewSkill("");
      return;
    }

    const updated = {
      ...profile,
      skills: [...profile.skills, newSkill.trim()]
    };
    onUpdateProfile(updated);
    setNewSkill("");
    triggerSaveNotification();
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    };
    onUpdateProfile(updated);
    triggerSaveNotification();
  };

  // Education updates
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduSchool.trim() || !eduDegree.trim()) return;

    const newEdu: Education = {
      school: eduSchool,
      degree: eduDegree,
      field: eduField || "N/A",
      duration: eduDuration || "2022-2026",
      gpa: eduGPA || "N/A"
    };

    const updated = {
      ...profile,
      education: [...profile.education, newEdu]
    };
    onUpdateProfile(updated);
    
    // Reset Form
    setEduSchool("");
    setEduDegree("");
    setEduField("");
    setEduDuration("");
    setEduGPA("");
    triggerSaveNotification();
  };

  const handleRemoveEducation = (index: number) => {
    const updated = {
      ...profile,
      education: profile.education.filter((_, idx) => idx !== index)
    };
    onUpdateProfile(updated);
    triggerSaveNotification();
  };

  // Experience updates
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;

    const newExp: WorkExperience = {
      role: expRole,
      company: expCompany,
      duration: expDuration,
      description: expDescription
    };

    const updated = {
      ...profile,
      experience: [...profile.experience, newExp]
    };
    onUpdateProfile(updated);

    // Reset Form
    setExpRole("");
    setExpCompany("");
    setExpDuration("");
    setExpDescription("");
    triggerSaveNotification();
  };

  const handleRemoveExperience = (index: number) => {
    const updated = {
      ...profile,
      experience: profile.experience.filter((_, idx) => idx !== index)
    };
    onUpdateProfile(updated);
    triggerSaveNotification();
  };

  // Project updates
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const newProj: Project = {
      title: projTitle,
      description: projDesc,
      technologies: projTech ? projTech.split(",").map(t => t.trim()) : [],
      link: projLink,
      date: projDate || "2024"
    };

    const updated = {
      ...profile,
      projects: [...profile.projects, newProj]
    };
    onUpdateProfile(updated);

    // Reset Form
    setProjTitle("");
    setProjDesc("");
    setProjTech("");
    setProjLink("");
    setProjDate("");
    triggerSaveNotification();
  };

  const handleRemoveProject = (index: number) => {
    const updated = {
      ...profile,
      projects: profile.projects.filter((_, idx) => idx !== index)
    };
    onUpdateProfile(updated);
    triggerSaveNotification();
  };

  // Certification updates
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;

    const newCert: Certification = {
      name: certName,
      issuer: certIssuer,
      date: certDate,
      credentialId: certID || "N/A"
    };

    const updated = {
      ...profile,
      certifications: [...profile.certifications, newCert]
    };
    onUpdateProfile(updated);

    // Reset Form
    setCertName("");
    setCertIssuer("");
    setCertDate("");
    setCertID("");
    triggerSaveNotification();
  };

  const handleRemoveCertification = (index: number) => {
    const updated = {
      ...profile,
      certifications: profile.certifications.filter((_, idx) => idx !== index)
    };
    onUpdateProfile(updated);
    triggerSaveNotification();
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <User className="w-6 h-6 text-brand-550" /> Profile Management
          </h1>
          <p className="text-xs text-slate-500">Construct comprehensive digital CVs to power automatic cover scanners and AI roadmaps.</p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle className="w-4 h-4" /> State Updated Successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Navigation Menu */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-1.5 select-none">
          {[
            { id: "Personal", label: "Personal Information", icon: User },
            { id: "Education", label: "Education & Work", icon: GraduationCap },
            { id: "Skills", label: "Skills & Projects", icon: FolderGit2 },
            { id: "Certifications", label: "Certifications", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full text-left p-3 rounded-xl transition text-xs font-bold flex items-center gap-2.5 cursor-pointer ${
                  activeSubTab === tab.id 
                    ? "bg-brand-550 text-white shadow-sm" 
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab panels container */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm min-h-[450px]">
          
          {/* SubTab 1: Personal info forms */}
          {activeSubTab === "Personal" && (
            <div className="space-y-6">
              <div className="border-b border-slate-50 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Personal Credentials</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">These inputs represent core credentials matching ATS metadata standards.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.personalInfo.name}
                    onChange={(e) => handlePersonalChange("name", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.personalInfo.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Job Title / College Tagline</label>
                  <input 
                    type="text" 
                    value={profile.personalInfo.title}
                    onChange={(e) => handlePersonalChange("title", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Office Location</label>
                  <input 
                    type="text" 
                    value={profile.personalInfo.location}
                    onChange={(e) => handlePersonalChange("location", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-brand-550" /> Portfolio & Workspace Web Links
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1 font-sans"><Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL</label>
                    <input 
                      type="text" 
                      value={profile.personalInfo.linkedin}
                      onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1 font-sans"><Github className="w-3.5 h-3.5 text-slate-800" /> GitHub username</label>
                    <input 
                      type="text" 
                      value={profile.personalInfo.github}
                      onChange={(e) => handlePersonalChange("github", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1 font-sans"><Globe className="w-3.5 h-3.5 text-slate-600" /> Personal Portfolio website</label>
                    <input 
                      type="text" 
                      value={profile.personalInfo.portfolio}
                      onChange={(e) => handlePersonalChange("portfolio", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Education & Work Experiences */}
          {activeSubTab === "Education" && (
            <div className="space-y-6">
              
              {/* Education section */}
              <div className="space-y-4">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Education Credentials</h3>
                  <p className="text-[11px] text-slate-400">List schools, undergraduate/postgraduate coursework, and grad GPAs.</p>
                </div>

                {/* List existings */}
                <div className="space-y-2.5">
                  {profile.education.map((edu, eduIdx) => (
                    <div key={eduIdx} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{edu.degree} in {edu.field}</p>
                        <p className="text-slate-500 font-medium">{edu.school} &bull; {edu.duration} &bull; GPA: <b className="font-mono text-slate-700">{edu.gpa}</b></p>
                      </div>
                      <button
                        onClick={() => handleRemoveEducation(eduIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Adding form */}
                <form onSubmit={handleAddEducation} className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 space-y-3 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Add School Log</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={eduSchool}
                      onChange={(e) => setEduSchool(e.target.value)}
                      placeholder="University Name (e.g. Stanford)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder="Degree (e.g. Bachelor of Science)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={eduField}
                      onChange={(e) => setEduField(e.target.value)}
                      placeholder="Field of Study (e.g. Computer Science)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input 
                      type="text" 
                      value={eduDuration}
                      onChange={(e) => setEduDuration(e.target.value)}
                      placeholder="Duration (e.g. 2022 - 2026)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={eduGPA}
                      onChange={(e) => setEduGPA(e.target.value)}
                      placeholder="Cumulative GPA (e.g. 3.8 / 4.0)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <button
                      type="submit"
                      className="bg-brand-550 hover:bg-blue-600 text-white font-bold p-2 rounded-xl text-[11px] transition shadow-sm cursor-pointer"
                    >
                      ✓ Save Education
                    </button>
                  </div>
                </form>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Work Experience Track</h3>
                  <p className="text-[11px] text-slate-400">Add key technical intern positions and university teaching assistance.</p>
                </div>

                {/* List existings */}
                <div className="space-y-3">
                  {profile.experience.map((exp, expIdx) => (
                    <div key={expIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-slate-800">{exp.role}</strong>
                          <span className="text-slate-400"> &bull; </span>
                          <span className="text-slate-600 font-semibold">{exp.company}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveExperience(expIdx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{exp.duration}</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">{exp.description}</p>
                    </div>
                  ))}
                </div>

                {/* Adding form */}
                <form onSubmit={handleAddExperience} className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 space-y-3 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Add Experience Log</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Role (e.g. Software Engineer Intern)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Company Name (e.g. Google)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={expDuration}
                      onChange={(e) => setExpDuration(e.target.value)}
                      placeholder="Duration (e.g. Jun - Sep 2024)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <textarea 
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="Core responsibilities, key achievements, or metrics optimized during this tenure..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-brand-550 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-[11px] transition shadow-sm cursor-pointer"
                      >
                        ✓ Save Experience
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* SubTab 3: Skills & Engineering Projects */}
          {activeSubTab === "Skills" && (
            <div className="space-y-6">
              
              {/* Dynamic Skills Builder tag input list */}
              <div className="space-y-4">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Technical Skills Aggregation</h3>
                  <p className="text-[11px] text-slate-400">Manage modern technologies, libraries, and skills to feed the ATS Comparison algorithms.</p>
                </div>

                {/* Live adding input form entry */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Type tool or programming technology name (e.g., Python, Kubernetes)"
                    id="new-skill-text-input"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-550 focus:border-brand-550 transition font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-brand-550 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-white" /> Add
                  </button>
                </form>

                {/* Display active tags list */}
                <div className="flex flex-wrap gap-2 pt-2 select-none">
                  {profile.skills.map((s, idx) => (
                    <div 
                      key={idx} 
                      className="bg-brand-50 border border-brand-200 text-brand-550 px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 group transition hover:border-brand-400 shadow-sm"
                    >
                      <span>{s}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(s)}
                        className="text-brand-500 hover:text-red-500 font-bold ml-1 hover:bg-slate-300/20 w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                        title="Delete skill"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering Projects List */}
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Featured Projects</h3>
                  <p className="text-[11px] text-slate-400">Describe engineering designs, links, and technologies employed.</p>
                </div>

                {/* List existings */}
                <div className="space-y-3">
                  {profile.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between gap-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-800 text-sm">{proj.title}</strong>
                        <button
                          onClick={() => handleRemoveProject(pIdx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400">{proj.date} &bull; {proj.link || "No URL"}</p>
                      <p className="text-slate-600 leading-normal text-[11px]">{proj.description}</p>
                      
                      {/* Sub tech pills */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {proj.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-extrabold bg-blue-100/50 text-brand-550 px-1.5 py-0.5 rounded font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adding form */}
                <form onSubmit={handleAddProject} className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 space-y-3 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Add Engineering Project</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Project Title (e.g. Chatbot API)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={projLink}
                      onChange={(e) => setProjLink(e.target.value)}
                      placeholder="Project Link URL"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={projDate}
                      onChange={(e) => setProjDate(e.target.value)}
                      placeholder="Date Completed (e.g. May 2024)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      placeholder="Comma separated Technologies employed (e.g., React, Node, WebSockets)"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 font-mono"
                    />
                    <textarea 
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Explain features, scale indicators, micro-animations utilized or database queries optimized..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-brand-550 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-[11px] transition shadow-sm cursor-pointer"
                      >
                        ✓ Save Project Layout
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* SubTab 4: Professional Certifications & achievements */}
          {activeSubTab === "Certifications" && (
            <div className="space-y-6">
              
              {/* Certifications sub list */}
              <div className="space-y-4">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">Professional Credentials</h3>
                  <p className="text-[11px] text-slate-400">List tech certifications, certificates, AWS, or bootcamp milestones.</p>
                </div>

                {/* List existings */}
                <div className="space-y-2.5">
                  {profile.certifications.map((cert, certIdx) => (
                    <div key={certIdx} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-4 text-xs font-semibold text-slate-700">
                      <div>
                        <p className="font-bold text-slate-800">{cert.name}</p>
                        <p className="text-slate-500 font-medium">{cert.issuer} &bull; Received: {cert.date} &bull; ID: <b className="font-mono text-[10px] bg-slate-100 px-1 border border-slate-200 text-slate-600 rounded">{cert.credentialId}</b></p>
                      </div>
                      <button
                        onClick={() => handleRemoveCertification(certIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Adding form */}
                <form onSubmit={handleAddCertification} className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 space-y-3 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Add Certification ID</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="Certification Name (e.g. AWS associate)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="Issuer Entity (e.g. Amazon Web Services)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input 
                      type="text" 
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="Date Received (e.g. March 2024)"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={certID}
                      onChange={(e) => setCertID(e.target.value)}
                      placeholder="Credential ID Number"
                      className="bg-white border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-brand-550 outline-none text-slate-700"
                    />
                    <button
                      type="submit"
                      className="bg-brand-550 hover:bg-blue-600 text-white font-bold p-2 rounded-xl text-[11px] transition shadow-sm cursor-pointer"
                    >
                      ✓ Save Cert
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

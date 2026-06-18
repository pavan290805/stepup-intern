"use client";

import React, { useMemo, useState } from "react";

type Skill = { id: string; name: string; category: "Frontend" | "Backend" | "Tools" | "ML/AI" };
type Project = { id: string; name: string; description: string; technologies: string[]; github?: string };
type Cert = { id: string; name: string; organization: string; date: string };
type Achievement = { id: string; title: string; description?: string };
type Internship = { id: string; company: string; role: string; duration: string; description?: string };
type Academic = { university: string; degree: string; graduationYear: string; gpa: string };

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
            Close
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

function ProjectEditor({
  initial, onSave, onCancel,
}: {
  initial: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [technologies, setTechnologies] = useState(initial.technologies.join(", "));
  const [github, setGithub] = useState(initial.github ?? "");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Project details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-gray-700">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
        <label className="block text-sm text-gray-700">
          GitHub URL
          <input value={github} onChange={(e) => setGithub(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
      </div>
      <label className="block text-sm text-gray-700">
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm" rows={4} />
      </label>
      <label className="block text-sm text-gray-700">
        Technologies (comma separated)
        <input value={technologies} onChange={(e) => setTechnologies(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
      </label>
      <div className="flex justify-end gap-3 pt-3">
        <button onClick={onCancel} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          onClick={() => onSave({
            ...initial,
            name: name.trim(),
            description: description.trim(),
            technologies: technologies.split(",").map((t) => t.trim()).filter(Boolean),
            github: github.trim(),
          })}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save project
        </button>
      </div>
    </div>
  );
}

function AcademicEditor({
  initial, onSave, onCancel,
}: {
  initial: Academic;
  onSave: (academic: Academic) => void;
  onCancel: () => void;
}) {
  const [university, setUniversity] = useState(initial.university);
  const [degree, setDegree] = useState(initial.degree);
  const [graduationYear, setGraduationYear] = useState(initial.graduationYear);
  const [gpa, setGpa] = useState(initial.gpa);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Academic details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-gray-700">
          University
          <input value={university} onChange={(e) => setUniversity(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
        <label className="block text-sm text-gray-700">
          Degree
          <input value={degree} onChange={(e) => setDegree(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-gray-700">
          Graduation year
          <input value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
        <label className="block text-sm text-gray-700">
          GPA
          <input value={gpa} onChange={(e) => setGpa(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-3">
        <button onClick={onCancel} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          onClick={() => onSave({ university: university.trim(), degree: degree.trim(), graduationYear: graduationYear.trim(), gpa: gpa.trim() })}
          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save academic
        </button>
      </div>
    </div>
  );
}

function PreviewModal({
  profile, onClose,
}: {
  profile: {
    name: string; studentTitle: string; university: string; email: string;
    phone: string; location: string; skills: Skill[]; projects: Project[];
    certs: Cert[]; achievements: Achievement[]; internships: Internship[];
    academic: Academic; resumeName: string | null; linkedIn: string;
    githubUrl: string; profileStrength: number;
  };
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Preview</h2>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium">Name:</span> {profile.name}</p>
            <p><span className="font-medium">Title:</span> {profile.studentTitle}</p>
            <p><span className="font-medium">University:</span> {profile.university}</p>
            <p><span className="font-medium">Email:</span> {profile.email}</p>
            <p><span className="font-medium">Phone:</span> {profile.phone}</p>
            <p><span className="font-medium">Location:</span> {profile.location}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
          <div className="space-y-2 text-sm">
            {profile.resumeName && <p><span className="font-medium">Resume:</span> {profile.resumeName}</p>}
            <p><span className="font-medium">LinkedIn:</span>{" "}
              <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="text-blue-600">{profile.linkedIn}</a></p>
            <p><span className="font-medium">GitHub:</span>{" "}
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600">{profile.githubUrl}</a></p>
          </div>
        </div>

        {profile.skills.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Frontend", "Backend", "Tools", "ML/AI"] as Skill["category"][]).map((cat) => {
                const catSkills = profile.skills.filter((s) => s.category === cat);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="font-medium text-sm text-gray-600 mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <span key={skill.id} className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {profile.projects.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects ({profile.projects.length})</h3>
            <div className="space-y-4">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <p className="font-medium text-gray-900">{proj.name}</p>
                  <p className="text-sm text-gray-600 mt-2">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {proj.technologies.map((tech, idx) => (
                        <span key={`${proj.id}-${idx}`} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1">{tech}</span>
                      ))}
                    </div>
                  )}
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs text-blue-600 mt-2 inline-block">GitHub →</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.certs.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications ({profile.certs.length})</h3>
            <div className="space-y-2 text-sm">
              {profile.certs.map((cert) => (
                <div key={cert.id}>
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.organization} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.achievements.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements ({profile.achievements.length})</h3>
            <div className="space-y-3 text-sm">
              {profile.achievements.map((ach) => (
                <div key={ach.id}>
                  <p className="font-medium text-gray-900">{ach.title}</p>
                  {ach.description && <p className="text-gray-600">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.internships.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Internships ({profile.internships.length})</h3>
            <div className="space-y-4 text-sm">
              {profile.internships.map((intern) => (
                <div key={intern.id}>
                  <p className="font-medium text-gray-900">{intern.role} at {intern.company}</p>
                  <p className="text-xs text-gray-500">{intern.duration}</p>
                  {intern.description && <p className="text-gray-600 mt-1">{intern.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Background</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">University:</span> {profile.academic.university}</p>
            <p><span className="font-medium">Degree:</span> {profile.academic.degree}</p>
            <p><span className="font-medium">Expected Graduation:</span> {profile.academic.graduationYear}</p>
            <p><span className="font-medium">GPA:</span> {profile.academic.gpa}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm">
            <span className="font-medium">Profile Strength: {profile.profileStrength}%</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function ProfileManagement() {
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("Alex Rivera");
  const [studentTitle, setStudentTitle] = useState("Final Year Computer Science Student");
  const [email, setEmail] = useState("alex.rivera@university.edu");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [location, setLocation] = useState("San Francisco, CA");
  const [university, setUniversity] = useState("Stanford University");

  const [skills, setSkills] = useState<Skill[]>([
    { id: uid("s"), name: "React",       category: "Frontend" },
    { id: uid("s"), name: "Tailwind CSS", category: "Frontend" },
    { id: uid("s"), name: "Node.js",      category: "Backend"  },
    { id: uid("s"), name: "Python",       category: "Backend"  },
    { id: uid("s"), name: "Git",          category: "Tools"    },
    { id: uid("s"), name: "TensorFlow",   category: "ML/AI"    },
  ]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<Skill["category"]>("Frontend");

  const [projects, setProjects] = useState<Project[]>([
    {
      id: uid("p"),
      name: "EcoTrack Mobile App",
      description: "Cross-platform sustainability tracker built with Flutter and Firebase.",
      technologies: ["Flutter", "Firebase"],
      github: "https://github.com/example/ecotrack",
    },
    {
      id: uid("p"),
      name: "SmartRecruit AI",
      description: "NLP-based resume parser that extracts skills with custom transformers.",
      technologies: ["Python", "Transformers"],
      github: "https://github.com/example/smartrecruit",
    },
  ]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [resumeName, setResumeName] = useState<string | null>(null);
  const [linkedIn, setLinkedIn] = useState("https://www.linkedin.com/in/alex-rivera");
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexrivera");

  const [certs, setCerts] = useState<Cert[]>([]);
  const [editingCert, setEditingCert] = useState<Cert | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const [internships, setInternships] = useState<Internship[]>([]);
  const [editingIntern, setEditingIntern] = useState<Internship | null>(null);
  const [showInternModal, setShowInternModal] = useState(false);

  const [academic, setAcademic] = useState<Academic>({
    university: "Stanford University",
    degree: "B.S. in Computer Science",
    graduationYear: "2024",
    gpa: "3.92/4.0",
  });
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const profileStrength = useMemo(() => {
    const required = [name, email, phone, location, university, studentTitle];
    const filled = required.filter((v) => v.trim() !== "").length;
    const personalScore = (filled / required.length) * 40;
    const skillScore = Math.min(skills.length, 6) / 6 * 25;
    const projectScore = Math.min(projects.length, 4) / 4 * 20;
    const resumeScore = resumeName ? 15 : 0;
    return Math.round(Math.min(100, personalScore + skillScore + projectScore + resumeScore));
  }, [name, email, phone, location, university, studentTitle, skills.length, projects.length, resumeName]);

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((c) => [...c, { id: uid("s"), name: newSkillName.trim(), category: newSkillCat }]);
    setNewSkillName("");
    setNewSkillCat("Frontend");
    setShowAddSkill(false);
  };

  const removeSkill = (id: string) => setSkills((c) => c.filter((s) => s.id !== id));

  const openNewProject = () => {
    setEditingProject({ id: uid("p"), name: "", description: "", technologies: [], github: "" });
    setShowProjectModal(true);
  };

  const saveProject = (project: Project) => {
    setProjects((c) => {
      const idx = c.findIndex((p) => p.id === project.id);
      if (idx !== -1) return c.map((p) => (p.id === project.id ? project : p));
      return [project, ...c];
    });
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const deleteProject = (id: string) => setProjects((c) => c.filter((p) => p.id !== id));

  const onResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) setResumeName(file.name);
  };

  const openNewCert = () => {
    setEditingCert({ id: uid("c"), name: "", organization: "", date: "" });
    setShowCertModal(true);
  };

  const saveCert = (cert: Cert) => {
    setCerts((c) => {
      const exists = c.find((x) => x.id === cert.id);
      if (exists) return c.map((x) => (x.id === cert.id ? cert : x));
      return [cert, ...c];
    });
    setShowCertModal(false);
    setEditingCert(null);
  };

  const deleteCert = (id: string) => setCerts((c) => c.filter((x) => x.id !== id));

  const openNewAchievement = () => {
    setEditingAchievement({ id: uid("a"), title: "", description: "" });
    setShowAchievementModal(true);
  };

  const saveAchievement = (achievement: Achievement) => {
    setAchievements((c) => {
      const exists = c.find((x) => x.id === achievement.id);
      if (exists) return c.map((x) => (x.id === achievement.id ? achievement : x));
      return [achievement, ...c];
    });
    setShowAchievementModal(false);
    setEditingAchievement(null);
  };

  const deleteAchievement = (id: string) => setAchievements((c) => c.filter((x) => x.id !== id));

  const openNewIntern = () => {
    setEditingIntern({ id: uid("i"), company: "", role: "", duration: "", description: "" });
    setShowInternModal(true);
  };

  const saveIntern = (intern: Internship) => {
    setInternships((c) => {
      const exists = c.find((x) => x.id === intern.id);
      if (exists) return c.map((x) => (x.id === intern.id ? intern : x));
      return [intern, ...c];
    });
    setShowInternModal(false);
    setEditingIntern(null);
  };

  const deleteIntern = (id: string) => setInternships((c) => c.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#0880EF]">Profile Management</h1>
            <p className="text-gray-600 mt-1">Update your student profile and career showcase in one place.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setEditMode((c) => !c)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
              {editMode ? "View profile" : "Edit profile"}
            </button>
            <button onClick={() => setShowPreview(true)}
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Preview
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left column */}
          <div className="space-y-6">

            {/* Profile card */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-3xl font-semibold text-gray-600">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span>{name.charAt(0)}</span>
                    )}
                  </div>
                  {editMode && (
                    <input type="file" accept="image/*"
                      onChange={(e) => { const f = e.currentTarget.files?.[0]; if (f) setProfileImage(URL.createObjectURL(f)); }}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                  <p className="text-sm text-gray-500">{studentTitle}</p>
                  <p className="text-sm text-gray-400 mt-2">{university}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-gray-700">
                {!editMode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><span className="font-medium text-gray-900">Email:</span><span>{email}</span></div>
                    <div className="flex items-center gap-2"><span className="font-medium text-gray-900">Phone:</span><span>{phone}</span></div>
                    <div className="flex items-center gap-2"><span className="font-medium text-gray-900">Location:</span><span>{location}</span></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      ["Full name", name, setName],
                      ["Title", studentTitle, setStudentTitle],
                      ["University", university, setUniversity],
                      ["Email", email, setEmail],
                      ["Phone", phone, setPhone],
                      ["Location", location, setLocation],
                    ].map(([label, value, setter]) => (
                      <label key={label as string} className="block text-sm text-gray-600">
                        {label as string}
                        <input value={value as string}
                          onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
                      </label>
                    ))}
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setEditMode(false)}
                        className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancel</button>
                      <button onClick={() => setEditMode(false)}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional links */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Professional links</h3>
              <div className="mt-5 space-y-4">
                <div className="flex flex-col gap-3 rounded-3xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">Resume</div>
                      <p className="text-sm text-gray-500">{resumeName ?? "No resume uploaded"}</p>
                    </div>
                    <label className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
                      Upload
                      <input type="file" accept="application/pdf" onChange={onResumeUpload} className="hidden" />
                    </label>
                  </div>
                  {resumeName && (
                    <button onClick={() => setResumeName(null)} className="text-left text-sm text-blue-600 underline">
                      Remove resume
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-gray-700">
                    LinkedIn URL
                    <input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
                  </label>
                  <label className="block text-sm text-gray-700">
                    GitHub URL
                    <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
                  </label>
                </div>
              </div>
            </div>

            {/* Profile strength */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Profile strength</h3>
              <div className="mt-4 space-y-3">
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${profileStrength}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{profileStrength}% complete</span>
                  <span>Keep your profile detailed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Skills */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Technical Arsenal</h2>
                  <p className="text-sm text-gray-500 mt-1">Organize your strongest skills by category.</p>
                </div>
                <button onClick={() => setShowAddSkill(true)}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  + Add skill
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(["Frontend", "Backend", "Tools", "ML/AI"] as Skill["category"][]).map((cat) => (
                  <div key={cat} className="rounded-3xl bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-600">{cat}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.filter((s) => s.category === cat).map((skill) => (
                        <span key={skill.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm">
                          <span>{skill.name}</span>
                          <button onClick={() => removeSkill(skill.id)} className="text-xs text-red-500 hover:text-red-700">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Key Projects</h2>
                  <p className="text-sm text-gray-500 mt-1">Display your best work with summary and tools.</p>
                </div>
                <button onClick={openNewProject}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  + Add project
                </button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                        <p className="mt-2 text-sm text-gray-600">{proj.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech, idx) => (
                          <span key={`${proj.id}-${idx}`} className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">{tech}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noreferrer"
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                            GitHub
                          </a>
                        )}
                        <button onClick={() => { setEditingProject(proj); setShowProjectModal(true); }}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
                        <button onClick={() => deleteProject(proj.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certs + Achievements */}
            <div className="grid gap-4 xl:grid-cols-2">

              <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                    <p className="text-sm text-gray-500 mt-1">Add certifications recruiters can review.</p>
                  </div>
                  <button onClick={openNewCert}
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ Add</button>
                </div>
                <div className="mt-6 space-y-3">
                  {certs.length === 0 ? (
                    <p className="text-sm text-gray-500">No certifications added.</p>
                  ) : (
                    certs.map((cert) => (
                      <div key={cert.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-900">{cert.name}</div>
                            <div className="text-sm text-gray-500">{cert.organization} • {cert.date}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditingCert(cert); setShowCertModal(true); }}
                              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
                            <button onClick={() => deleteCert(cert.id)}
                              className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                    <p className="text-sm text-gray-500 mt-1">Capture awards, clubs and leadership wins.</p>
                  </div>
                  <button onClick={openNewAchievement}
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ Add</button>
                </div>
                <div className="mt-6 space-y-3">
                  {achievements.length === 0 ? (
                    <p className="text-sm text-gray-500">No achievements yet.</p>
                  ) : (
                    achievements.map((ach) => (
                      <div key={ach.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-gray-900">{ach.title}</div>
                            <div className="text-sm text-gray-500">{ach.description}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditingAchievement(ach); setShowAchievementModal(true); }}
                              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
                            <button onClick={() => deleteAchievement(ach.id)}
                              className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Internships */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Internship history</h2>
                  <p className="text-sm text-gray-500 mt-1">Track work experience and impact.</p>
                </div>
                <button onClick={openNewIntern}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ Add experience</button>
              </div>
              <div className="mt-6 space-y-4">
                {internships.length === 0 ? (
                  <p className="text-sm text-gray-500">No internship experiences added.</p>
                ) : (
                  internships.map((intern) => (
                    <div key={intern.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{intern.role} • {intern.company}</div>
                          <div className="text-sm text-gray-500">{intern.duration}</div>
                          <p className="mt-2 text-sm text-gray-600">{intern.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => { setEditingIntern(intern); setShowInternModal(true); }}
                            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                          <button onClick={() => deleteIntern(intern.id)}
                            className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Academic */}
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Academic background</h2>
                  <p className="text-sm text-gray-500 mt-1">Keep your degree and GPA current.</p>
                </div>
                <button onClick={() => setEditingAcademic(true)}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Edit</button>
              </div>
              <div className="mt-6">
                {editingAcademic ? (
                  <AcademicEditor initial={academic} onSave={(a) => { setAcademic(a); setEditingAcademic(false); }} onCancel={() => setEditingAcademic(false)} />
                ) : (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="font-medium text-gray-900">{academic.university}</div>
                    <div>{academic.degree} • Expected {academic.graduationYear}</div>
                    <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">GPA: {academic.gpa}</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {showPreview && (
        <PreviewModal
          profile={{ name, studentTitle, university, email, phone, location, skills, projects, certs, achievements, internships, academic, resumeName, linkedIn, githubUrl, profileStrength }}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showAddSkill && (
        <Modal onClose={() => setShowAddSkill(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Add skill</h3>
            <label className="block text-sm text-gray-700">
              Skill name
              <input value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" placeholder="e.g. Next.js" />
            </label>
            <label className="block text-sm text-gray-700">
              Category
              <select value={newSkillCat} onChange={(e) => setNewSkillCat(e.target.value as Skill["category"])}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm">
                <option>Frontend</option><option>Backend</option><option>Tools</option><option>ML/AI</option>
              </select>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAddSkill(false)} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={addSkill} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add skill</button>
            </div>
          </div>
        </Modal>
      )}

      {showProjectModal && editingProject && (
        <Modal onClose={() => { setShowProjectModal(false); setEditingProject(null); }}>
          <ProjectEditor
            initial={editingProject}
            onSave={saveProject}
            onCancel={() => { setShowProjectModal(false); setEditingProject(null); }}
          />
        </Modal>
      )}

      {showCertModal && editingCert && (
        <Modal onClose={() => { setShowCertModal(false); setEditingCert(null); }}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Certification</h3>
            {(["name", "organization", "date"] as (keyof Cert)[]).map((field) => (
              <label key={field} className="block text-sm text-gray-700 capitalize">
                {field}
                <input
                  value={editingCert[field] as string}
                  onChange={(e) => setEditingCert({ ...editingCert, [field]: e.target.value })}
                  placeholder={field === "date" ? "August 2025" : ""}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm"
                />
              </label>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowCertModal(false); setEditingCert(null); }}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={() => saveCert(editingCert)}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {showAchievementModal && editingAchievement && (
        <Modal onClose={() => { setShowAchievementModal(false); setEditingAchievement(null); }}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Achievement</h3>
            <label className="block text-sm text-gray-700">
              Title
              <input value={editingAchievement.title}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm" />
            </label>
            <label className="block text-sm text-gray-700">
              Description
              <textarea value={editingAchievement.description}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm" rows={4} />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowAchievementModal(false); setEditingAchievement(null); }}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={() => saveAchievement(editingAchievement)}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {showInternModal && editingIntern && (
        <Modal onClose={() => { setShowInternModal(false); setEditingIntern(null); }}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Internship</h3>
            {[
              ["Company", "company"],
              ["Role", "role"],
              ["Duration", "duration"],
            ].map(([label, field]) => (
              <label key={field} className="block text-sm text-gray-700">
                {label}
                <input
                  value={(editingIntern as Record<string, string>)[field]}
                  onChange={(e) => setEditingIntern({ ...editingIntern, [field]: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm"
                />
              </label>
            ))}
            <label className="block text-sm text-gray-700">
              Description
              <textarea value={editingIntern.description}
                onChange={(e) => setEditingIntern({ ...editingIntern, description: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm" rows={4} />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowInternModal(false); setEditingIntern(null); }}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={() => saveIntern(editingIntern)}
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useCallback } from "react";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

type Priority = "HIGH" | "MEDIUM" | "LOW";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type ResourceType = "COURSE" | "CERTIFICATION" | "PROJECT";
type ProgressStatus = "completed" | "in-progress" | "remaining";
type ReadinessLevel = "Beginner" | "Developing" | "Intermediate" | "Job Ready";

interface MissingSkill {
  name: string;
  priority: Priority;
}

interface RoadmapPhase {
  step: number;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
}

interface Recommendation {
  type: ResourceType;
  title: string;
  subtitle: string;
  icon: string;
}

interface SkillProgress {
  name: string;
  status: ProgressStatus;
}

/** Central result object — UI renders exclusively from this */
interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  recommendations: Recommendation[];
  roadmap: RoadmapPhase[];
  readinessLevel: ReadinessLevel;
  detectedSkills: string[];
  requiredSkills: string[];
  skillProgress: SkillProgress[];
  topStrength: string;
  growthArea: string;
}

// ─── Centralized Skill Database ────────────────────────────────────────────────
// Add new skills here — matching is case-insensitive everywhere

const SKILL_DATABASE: string[] = [
  "Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go",
  "Rust", "Kotlin", "Swift", "Ruby", "PHP", "Scala",
  "React", "Next.js", "Vue", "Angular", "HTML", "CSS", "Tailwind CSS",
  "Bootstrap", "SASS", "SCSS", "Redux", "GraphQL",
  "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot",
  "REST API", "RESTful", "Microservices",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "SQLite",
  "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "Cloud Computing", "CI/CD", "Linux",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "LLMs",
  "RAG", "Agentic AI", "NLP", "Computer Vision", "Data Science",
  "Pandas", "NumPy", "Scikit-learn",
  "Data Structures", "Algorithms", "Problem Solving",
  "Communication", "Leadership", "Teamwork", "Agile", "Scrum",
];

// ─── Skill Alias Map ──────────────────────────────────────────────────────────

const SKILL_ALIASES: Record<string, string[]> = {
  JavaScript:         ["javascript", "js", "java script"],
  TypeScript:         ["typescript", "ts"],
  Python:             ["python", "python3", "py"],
  Java:               ["java"],
  "C++":              ["c++", "cpp", "c plus plus"],
  "C#":               ["c#", "csharp", "c sharp"],
  Go:                 ["golang", "go"],
  Kotlin:             ["kotlin"],
  Swift:              ["swift"],
  Ruby:               ["ruby", "ruby on rails", "ror"],
  PHP:                ["php"],
  Scala:              ["scala"],
  Rust:               ["rust", "rust-lang"],
  React:              ["react", "react.js", "reactjs", "react js"],
  "Next.js":          ["next", "next.js", "nextjs", "next js"],
  Vue:                ["vue", "vue.js", "vuejs", "vue js"],
  Angular:            ["angular", "angularjs", "angular.js"],
  HTML:               ["html", "html5"],
  CSS:                ["css", "css3"],
  "Tailwind CSS":     ["tailwind", "tailwindcss", "tailwind css"],
  Bootstrap:          ["bootstrap"],
  SASS:               ["sass", "scss"],
  SCSS:               ["scss"],
  Redux:              ["redux", "redux toolkit", "rtk"],
  GraphQL:            ["graphql", "graph ql"],
  "Node.js":          ["node", "node.js", "nodejs", "node js"],
  "Express.js":       ["express", "express.js", "expressjs", "express js"],
  Django:             ["django"],
  Flask:              ["flask"],
  FastAPI:            ["fastapi", "fast api"],
  "Spring Boot":      ["spring", "spring boot", "springboot"],
  "REST API":         ["rest", "rest api", "rest apis", "restful", "restful api", "restful apis"],
  Microservices:      ["microservices", "micro services", "microservice"],
  SQL:                ["sql"],
  MySQL:              ["mysql"],
  PostgreSQL:         ["postgresql", "postgres", "postgre sql"],
  MongoDB:            ["mongodb", "mongo", "mongo db"],
  Firebase:           ["firebase", "fire base"],
  Redis:              ["redis"],
  SQLite:             ["sqlite", "sql lite"],
  Git:                ["git"],
  GitHub:             ["github", "git hub"],
  Docker:             ["docker"],
  Kubernetes:         ["kubernetes", "k8s"],
  AWS:                ["aws", "amazon web services"],
  Azure:              ["azure", "microsoft azure"],
  GCP:                ["gcp", "google cloud", "google cloud platform"],
  "Cloud Computing":  ["cloud computing", "cloud"],
  "CI/CD":            ["ci/cd", "cicd", "ci cd", "continuous integration", "continuous deployment"],
  Linux:              ["linux", "unix"],
  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning":    ["deep learning", "dl"],
  TensorFlow:         ["tensorflow", "tensor flow", "tf"],
  PyTorch:            ["pytorch", "py torch"],
  LLMs:               ["llm", "llms", "large language model", "large language models"],
  RAG:                ["rag", "retrieval augmented generation", "retrieval-augmented generation"],
  "Agentic AI":       ["agentic ai", "agentic", "ai agents", "autonomous agents"],
  NLP:                ["nlp", "natural language processing"],
  "Computer Vision":  ["computer vision", "cv"],
  "Data Science":     ["data science", "data scientist"],
  Pandas:             ["pandas"],
  NumPy:              ["numpy"],
  "Scikit-learn":     ["scikit-learn", "sklearn", "scikit learn"],
  "Data Structures":  ["data structures", "data structure"],
  Algorithms:         ["algorithms", "algorithm", "dsa"],
  "Problem Solving":  ["problem solving", "problem-solving"],
  Communication:      ["communication"],
  Leadership:         ["leadership"],
  Teamwork:           ["teamwork", "team work", "collaboration"],
  Agile:              ["agile"],
  Scrum:              ["scrum"],
};

// ─── Pre-compiled Skill Patterns ──────────────────────────────────────────────

interface SkillPattern {
  canonical: string;
  regex: RegExp;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSkillPattern(canonical: string): SkillPattern {
  const aliases = SKILL_ALIASES[canonical] ?? [canonical.toLowerCase()];
  const alternations = aliases.map((alias) => {
    const esc = escapeRegex(alias);
    const startsAlpha = /^[a-z0-9]/i.test(alias);
    const endsAlpha   = /[a-z0-9]$/i.test(alias);
    const prefix = startsAlpha ? "(?<![a-zA-Z0-9_])" : "";
    const suffix = endsAlpha   ? "(?![a-zA-Z0-9_])"  : "(?![a-zA-Z0-9])";
    return `${prefix}${esc}${suffix}`;
  });
  const regex = new RegExp(alternations.join("|"), "i");
  return { canonical, regex };
}

const SKILL_PATTERNS: SkillPattern[] = SKILL_DATABASE.map(buildSkillPattern);

// ─── Skill Recommendation Map ─────────────────────────────────────────────────

interface SkillRecommendationConfig {
  title: string;
  subtitle: string;
  type: ResourceType;
  icon: string;
}

const SKILL_RECOMMENDATION_MAP: Record<string, SkillRecommendationConfig> = {
  TypeScript:         { title: "TypeScript Fundamentals",       subtitle: "Learn static typing for JS",           type: "COURSE",        icon: "🎓" },
  "Next.js":          { title: "Build a Next.js Project",       subtitle: "App Router & Server Components",       type: "PROJECT",       icon: "💻" },
  Git:                { title: "Practice Version Control",       subtitle: "Git branching & workflows",            type: "COURSE",        icon: "🎓" },
  GitHub:             { title: "GitHub Collaboration",           subtitle: "PRs, Issues, Actions",                 type: "COURSE",        icon: "🎓" },
  AWS:                { title: "Learn Cloud Deployment",         subtitle: "AWS fundamentals & services",          type: "CERTIFICATION", icon: "📜" },
  Azure:              { title: "Azure Fundamentals",             subtitle: "Microsoft cloud certification",        type: "CERTIFICATION", icon: "📜" },
  "REST API":         { title: "Practice API Integration",       subtitle: "Build & consume REST APIs",            type: "PROJECT",       icon: "💻" },
  RESTful:            { title: "Practice API Integration",       subtitle: "Build & consume REST APIs",            type: "PROJECT",       icon: "💻" },
  GraphQL:            { title: "GraphQL API Design",             subtitle: "Queries, mutations, subscriptions",    type: "COURSE",        icon: "🎓" },
  Docker:             { title: "Docker Containerization",        subtitle: "Containers & Docker Compose",          type: "COURSE",        icon: "🎓" },
  Kubernetes:         { title: "Kubernetes Orchestration",       subtitle: "Deploy & scale containers",            type: "CERTIFICATION", icon: "📜" },
  "Machine Learning": { title: "ML Crash Course",               subtitle: "Supervised & unsupervised learning",   type: "COURSE",        icon: "🎓" },
  "Deep Learning":    { title: "Deep Learning Specialization",  subtitle: "Neural networks & architectures",      type: "CERTIFICATION", icon: "📜" },
  Python:             { title: "Python for Developers",          subtitle: "Core Python & best practices",         type: "COURSE",        icon: "🎓" },
  Java:               { title: "Java Programming",               subtitle: "OOP & Java ecosystem",                 type: "COURSE",        icon: "🎓" },
  React:              { title: "React Development",              subtitle: "Hooks, Context, and patterns",         type: "COURSE",        icon: "🎓" },
  "Node.js":          { title: "Node.js Backend Dev",            subtitle: "Server-side JS development",           type: "COURSE",        icon: "🎓" },
  "Express.js":       { title: "Express.js API Building",        subtitle: "RESTful APIs with Express",            type: "PROJECT",       icon: "💻" },
  SQL:                { title: "SQL Mastery",                    subtitle: "Queries, joins, optimization",         type: "COURSE",        icon: "🎓" },
  MongoDB:            { title: "MongoDB Basics",                 subtitle: "NoSQL data modeling",                  type: "COURSE",        icon: "🎓" },
  PostgreSQL:         { title: "PostgreSQL Deep Dive",           subtitle: "Advanced relational DB",               type: "COURSE",        icon: "🎓" },
  LLMs:               { title: "LLM Development",               subtitle: "Prompt engineering & fine-tuning",     type: "COURSE",        icon: "🎓" },
  RAG:                { title: "RAG Pipeline Project",           subtitle: "Retrieval-augmented generation",       type: "PROJECT",       icon: "💻" },
  "Agentic AI":       { title: "Agentic AI Systems",             subtitle: "Build autonomous AI agents",           type: "PROJECT",       icon: "💻" },
};

// ─── Roadmap Phase Templates ──────────────────────────────────────────────────

interface RoadmapTemplate {
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
}

const ROADMAP_TEMPLATES: Record<string, RoadmapTemplate> = {
  TypeScript:         { title: "TypeScript Fundamentals",    description: "Master static typing and interfaces for better code quality.",            duration: "2 Weeks", difficulty: "Intermediate" },
  "Next.js":          { title: "Next.js Development",        description: "Explore Server Components and App Router in the modern framework.",        duration: "3 Weeks", difficulty: "Intermediate" },
  React:              { title: "React Essentials",           description: "Learn hooks, context, and modern React patterns.",                         duration: "3 Weeks", difficulty: "Intermediate" },
  Python:             { title: "Python Fundamentals",        description: "Core Python syntax, OOP, and standard library.",                           duration: "2 Weeks", difficulty: "Beginner"     },
  Java:               { title: "Java Programming",           description: "Object-oriented design and Java ecosystem.",                               duration: "3 Weeks", difficulty: "Intermediate" },
  Docker:             { title: "Docker Containerization",    description: "Package and deploy apps with Docker.",                                      duration: "1 Week",  difficulty: "Intermediate" },
  Kubernetes:         { title: "Kubernetes Orchestration",   description: "Scale containerized apps in production.",                                   duration: "2 Weeks", difficulty: "Advanced"     },
  AWS:                { title: "AWS Cloud Basics",           description: "Core AWS services and deployment patterns.",                                duration: "3 Weeks", difficulty: "Intermediate" },
  Azure:              { title: "Azure Cloud Fundamentals",   description: "Microsoft Azure services and certification prep.",                          duration: "3 Weeks", difficulty: "Intermediate" },
  "Machine Learning": { title: "Machine Learning Basics",    description: "Supervised & unsupervised learning algorithms.",                            duration: "4 Weeks", difficulty: "Advanced"     },
  SQL:                { title: "SQL & Databases",            description: "Relational database design and complex queries.",                           duration: "2 Weeks", difficulty: "Beginner"     },
  GraphQL:            { title: "GraphQL API Design",         description: "Schema design, resolvers, and client integration.",                         duration: "2 Weeks", difficulty: "Intermediate" },
  MongoDB:            { title: "MongoDB NoSQL",              description: "Document modeling and aggregation pipelines.",                              duration: "1 Week",  difficulty: "Beginner"     },
  Git:                { title: "Git Version Control",        description: "Branching strategies and team workflows.",                                  duration: "1 Week",  difficulty: "Beginner"     },
  "Node.js":          { title: "Node.js Backend",            description: "Server-side JavaScript and async programming.",                             duration: "3 Weeks", difficulty: "Intermediate" },
  "Deep Learning":    { title: "Deep Learning",              description: "Neural networks, CNNs, RNNs and modern architectures.",                     duration: "6 Weeks", difficulty: "Advanced"     },
  LLMs:               { title: "LLM Development",            description: "Prompt engineering, fine-tuning, and deployment.",                          duration: "3 Weeks", difficulty: "Advanced"     },
  RAG:                { title: "RAG Pipeline Development",   description: "Build retrieval-augmented generation systems.",                             duration: "2 Weeks", difficulty: "Advanced"     },
};

const DEFAULT_PHASE: Omit<RoadmapTemplate, "title"> = {
  description: "Build practical skills through hands-on projects.",
  duration: "2 Weeks",
  difficulty: "Intermediate",
};

// ─── Analysis Engine ──────────────────────────────────────────────────────────
// All logic below is preserved exactly. These are the backend integration points.

function extractTxtText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read text file"));
    reader.readAsText(file);
  });
}

async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    textParts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return textParts.join("\n");
}

async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const mod = (mammoth as unknown as { default?: typeof mammoth });
  const lib = mod.default ?? mammoth;
  const result = await lib.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * BACKEND INTEGRATION POINT — extractFileText
 * Replace body with: fetch('/api/extract-text', { method:'POST', body: formData })
 */
async function extractFileText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "txt")                   return extractTxtText(file);
  if (ext === "pdf")                   return extractPdfText(file);
  if (ext === "docx" || ext === "doc") return extractDocxText(file);
  throw new Error(`Unsupported file type: .${ext}`);
}

async function extractResumeText(file: File): Promise<string> {
  return extractFileText(file);
}

function extractSkills(text: string): string[] {
  if (!text.trim()) return [];
  return SKILL_PATTERNS.filter(({ regex }) => regex.test(text)).map(({ canonical }) => canonical);
}

function compareSkills(
  resumeSkills: string[],
  requiredSkills: string[]
): { matchedSkills: string[]; missingSkills: string[] } {
  const lowerResume = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of requiredSkills) {
    (lowerResume.has(skill.toLowerCase()) ? matched : missing).push(skill);
  }
  return { matchedSkills: matched, missingSkills: missing };
}

function calculateMatchScore(matchedSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 0;
  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
}

function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 80) return "Job Ready";
  if (score >= 60) return "Intermediate";
  if (score >= 40) return "Developing";
  return "Beginner";
}

function assignPriority(index: number, total: number): Priority {
  if (index < Math.ceil(total / 3))       return "HIGH";
  if (index < Math.ceil((2 * total) / 3)) return "MEDIUM";
  return "LOW";
}

function generateRecommendations(missingSkillNames: string[]): Recommendation[] {
  const recs: Recommendation[] = [];
  for (const skill of missingSkillNames) {
    if (recs.length >= 3) break;
    const config = SKILL_RECOMMENDATION_MAP[skill];
    recs.push(config
      ? { type: config.type, title: config.title, subtitle: config.subtitle, icon: config.icon }
      : { type: "COURSE", title: `Learn ${skill}`, subtitle: `Build proficiency in ${skill}`, icon: "🎓" }
    );
  }
  if (recs.length < 3 && missingSkillNames.length > 0) {
    recs.push({ type: "PROJECT", title: "Portfolio Project", subtitle: "Apply your skills in a real project", icon: "💻" });
  }
  return recs;
}

function generateRoadmap(missingSkillNames: string[], matchedSkillNames: string[]): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];
  missingSkillNames.slice(0, 3).forEach((skill, i) => {
    const t = ROADMAP_TEMPLATES[skill];
    phases.push({
      step: i + 1,
      title: t?.title ?? `Learn ${skill}`,
      description: t?.description ?? DEFAULT_PHASE.description,
      duration: t?.duration ?? DEFAULT_PHASE.duration,
      difficulty: t?.difficulty ?? DEFAULT_PHASE.difficulty,
    });
  });
  if (matchedSkillNames.length > 0 || missingSkillNames.length > 0) {
    phases.push({
      step: phases.length + 1,
      title: "Portfolio Project",
      description: "Apply all acquired skills by building a production-ready project for your portfolio.",
      duration: "4 Weeks",
      difficulty: "Advanced",
    });
  }
  return phases;
}

function buildSkillProgress(matchedSkills: string[], missingSkillNames: string[]): SkillProgress[] {
  return [
    ...matchedSkills.map((s) => ({ name: s, status: "completed" as ProgressStatus })),
    ...missingSkillNames.map((s, i) => ({
      name: s,
      status: (i === 0 ? "in-progress" : "remaining") as ProgressStatus,
    })),
  ];
}

function deriveTopStrength(matchedSkills: string[]): string {
  const frameworks = matchedSkills.filter((s) =>
    ["React", "Next.js", "Vue", "Angular", "Node.js", "Django", "Flask"].includes(s)
  );
  if (frameworks.length) return frameworks[0];
  if (matchedSkills.length) return matchedSkills[0];
  return "General Skills";
}

function deriveGrowthArea(missingSkills: string[]): string {
  if (missingSkills.some((s) => ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD"].includes(s))) return "Cloud & DevOps";
  if (missingSkills.some((s) => ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "LLMs", "RAG"].includes(s))) return "AI & ML";
  if (missingSkills.some((s) => ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis"].includes(s))) return "Databases";
  if (missingSkills.length) return missingSkills[0];
  return "Further Specialization";
}

/**
 * BACKEND INTEGRATION POINT — performAnalysis
 * Replace with: fetch('/api/analyze-skills', { method:'POST', body: formData })
 * resumeFile, roleDescription, and jdFile are all ready to forward as-is.
 */
async function performAnalysis(
  resumeFile: File,
  roleDescription: string,
  jdFile?: File | null
): Promise<AnalysisResult> {
  let jdText = roleDescription;
  if (jdFile) {
    const extracted = await extractFileText(jdFile);
    if (extracted.trim()) jdText = extracted;
  }
  const resumeText = await extractResumeText(resumeFile);
  if (!resumeText.trim()) throw new Error("No text could be extracted from your resume. Please check the file.");
  const detectedSkills = extractSkills(resumeText);
  const requiredSkills = extractSkills(jdText);
  if (requiredSkills.length === 0) throw new Error("No recognizable skills found in the job description. Please include specific skill requirements.");
  const { matchedSkills, missingSkills: missingSkillNames } = compareSkills(detectedSkills, requiredSkills);
  const missingSkills: MissingSkill[] = missingSkillNames.map((name, i) => ({ name, priority: assignPriority(i, missingSkillNames.length) }));
  const matchScore     = calculateMatchScore(matchedSkills, requiredSkills);
  const readinessLevel = getReadinessLevel(matchScore);
  const recommendations = generateRecommendations(missingSkillNames);
  const roadmap        = generateRoadmap(missingSkillNames, matchedSkills);
  const skillProgress  = buildSkillProgress(matchedSkills, missingSkillNames);
  const topStrength    = deriveTopStrength(matchedSkills);
  const growthArea     = deriveGrowthArea(missingSkillNames);
  return { matchScore, matchedSkills, missingSkills, recommendations, roadmap, readinessLevel, detectedSkills, requiredSkills, skillProgress, topStrength, growthArea };
}

// ─── Shared Badge Components ──────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Beginner:     "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced:     "bg-red-100 text-red-700",
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[difficulty]}`}>{difficulty}</span>;
}

function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const styles: Record<ResourceType, string> = {
    COURSE:        "bg-blue-100 text-blue-600",
    CERTIFICATION: "bg-purple-100 text-purple-600",
    PROJECT:       "bg-emerald-100 text-emerald-600",
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${styles[type]}`}>{type}</span>;
}

// ─── Circular Progress (hero score) ──────────────────────────────────────────

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 60;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;
  const color  = percentage >= 80 ? "#22c55e" : percentage >= 60 ? "#0880EF" : percentage >= 40 ? "#eab308" : "#f97316";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 152, height: 152 }}>
      <svg width="152" height="152" className="rotate-[-90deg]">
        <circle cx="76" cy="76" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="12" />
        <circle cx="76" cy="76" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-gray-900 leading-none">{percentage}%</span>
        <span className="text-xs text-gray-500 mt-1 font-medium">Match Score</span>
      </div>
    </div>
  );
}

// ─── JD Input Mode ────────────────────────────────────────────────────────────

type JDInputMode = "paste" | "upload";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SkillGapAnalyzer() {

  // ── Resume state ──
  const [uploadedFile, setUploadedFile]   = useState<File | null>(null);
  const [isDragging, setIsDragging]       = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  // ── Job Description state ──
  const [jdInputMode, setJdInputMode]     = useState<JDInputMode>("paste");
  const [roleDescription, setRoleDescription] = useState("");
  const [jdFile, setJdFile]               = useState<File | null>(null);
  const [isJdDragging, setIsJdDragging]   = useState(false);
  const jdFileInputRef                    = useRef<HTMLInputElement>(null);

  // ── Analysis state ──
  const [isAnalyzed, setIsAnalyzed]       = useState(false);
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // ── Scroll ref for auto-scroll to results ──
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Derived ──
  const hasJD      = jdInputMode === "upload" ? jdFile !== null : roleDescription.trim().length > 0;
  const canAnalyze = uploadedFile !== null && hasJD;

  // ── Resume handlers ──
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx", "txt"].includes(ext)) {
      setAnalysisError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setAnalysisError(null); setIsAnalyzed(false); setAnalysisResult(null);
    setUploadedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleDragOver  = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleRemoveFile = () => {
    setUploadedFile(null); setIsAnalyzed(false); setAnalysisResult(null); setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── JD handlers ──
  const handleJdFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt"].includes(ext)) {
      setAnalysisError("Unsupported JD file type. Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setAnalysisError(null); setIsAnalyzed(false); setAnalysisResult(null);
    setJdFile(file);
  }, []);

  const handleJdDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsJdDragging(false);
    handleJdFileSelect(e.dataTransfer.files[0]);
  }, [handleJdFileSelect]);

  const handleJdDragOver  = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsJdDragging(true); };
  const handleJdDragLeave = () => setIsJdDragging(false);
  const handleRemoveJdFile = () => {
    setJdFile(null); setIsAnalyzed(false); setAnalysisResult(null);
    if (jdFileInputRef.current) jdFileInputRef.current.value = "";
  };

  // ── Analysis handler ──
  const handleAnalyze = async () => {
    if (!canAnalyze || !uploadedFile) return;
    setIsAnalyzing(true); setAnalysisError(null); setIsAnalyzed(false); setAnalysisResult(null);
    try {
      // BACKEND INTEGRATION POINT: Replace performAnalysis with a fetch('/api/analyze-skills', ...)
      // resumeFile = uploadedFile, jdFile and roleDescription are both available here.
      const result = await performAnalysis(uploadedFile, roleDescription, jdFile);
      setAnalysisResult(result);
      setIsAnalyzed(true);
      // Auto-scroll: small delay lets React paint the results DOM first
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Derived skill progress ──
  const completedSkills    = analysisResult?.skillProgress.filter((s) => s.status === "completed")   ?? [];
  const inProgressSkills   = analysisResult?.skillProgress.filter((s) => s.status === "in-progress") ?? [];
  const remainingSkills    = analysisResult?.skillProgress.filter((s) => s.status === "remaining")   ?? [];
  const totalTracked       = analysisResult?.skillProgress.length ?? 1;
  const overallProgressPct = Math.round((completedSkills.length / totalTracked) * 100);

  // Grouped missing skills by priority
  const highMissing   = analysisResult?.missingSkills.filter((s) => s.priority === "HIGH")   ?? [];
  const mediumMissing = analysisResult?.missingSkills.filter((s) => s.priority === "MEDIUM") ?? [];
  const lowMissing    = analysisResult?.missingSkills.filter((s) => s.priority === "LOW")    ?? [];

  // ── Readiness colour helper ──
  const readinessColor: Record<ReadinessLevel, string> = {
    "Job Ready":    "text-green-600  bg-green-50  border-green-200",
    "Intermediate": "text-blue-600   bg-blue-50   border-blue-200",
    "Developing":   "text-yellow-600 bg-yellow-50 border-yellow-200",
    "Beginner":     "text-orange-600 bg-orange-50 border-orange-200",
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0880EF] mb-1">Skill Gap Analyzer</h1>
          <p className="text-gray-500 text-sm">
            Compare your resume against job requirements and get a personalized growth roadmap.
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            PHASE 1–2: Two-Column Input Dashboard
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* ── LEFT: Career Intelligence Panel — single unified gradient card ── */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-[#0880EF] via-[#0770d8] to-[#0452a8] rounded-2xl text-white overflow-hidden shadow-xl shadow-blue-300/40 flex flex-col h-full min-h-[520px]">

              {/* ── Decorative background blobs ── */}
              <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute top-1/2 -right-8 w-28 h-28 rounded-full bg-white/[0.04] pointer-events-none" />

              {/* ── Content ── */}
              <div className="relative z-10 flex flex-col flex-1 p-7">

                {/* 1. Icon + label row */}
                <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">Career Intelligence</span>
                </div>

                {/* 2. Title */}
                <h2 className="text-[1.6rem] font-extrabold leading-tight tracking-tight mb-3">
                  Your Personal<br />Career Dashboard
                </h2>

                {/* 3. Tagline — short, premium SaaS-style */}
                <p className="text-blue-200 text-sm leading-relaxed mb-6 max-w-[260px]">
                  Analyze your resume. Discover gaps.<br />Build your roadmap.
                </p>

                {/* 4. Large SVG illustration */}
                <div className="flex-1 flex items-center justify-center mb-5 min-h-[160px]">
                  <svg
                    viewBox="0 0 340 220"
                    className="w-full max-w-[320px]"
                    fill="none"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {/* ── Resume document (left) ── */}
                    <g opacity="0.18">
                      <rect x="20" y="30" width="88" height="114" rx="6" strokeWidth="2" />
                      <rect x="20" y="30" width="88" height="22" rx="6" fill="white" fillOpacity="0.15" strokeWidth="0" />
                      <line x1="32" y1="66" x2="94" y2="66" strokeWidth="2" />
                      <line x1="32" y1="78" x2="86" y2="78" strokeWidth="1.5" />
                      <line x1="32" y1="90" x2="90" y2="90" strokeWidth="1.5" />
                      <line x1="32" y1="102" x2="80" y2="102" strokeWidth="1.5" />
                      <line x1="32" y1="114" x2="88" y2="114" strokeWidth="1.5" />
                      <line x1="32" y1="126" x2="75" y2="126" strokeWidth="1.5" />
                      <circle cx="36" cy="66" r="3" fill="white" fillOpacity="0.3" strokeWidth="0" />
                    </g>

                    {/* ── Skills dashboard / bar chart (center) ── */}
                    <g opacity="0.18">
                      <rect x="126" y="18" width="108" height="126" rx="7" strokeWidth="2" />
                      <rect x="126" y="18" width="108" height="20" rx="7" fill="white" fillOpacity="0.12" strokeWidth="0" />
                      <line x1="138" y1="27" x2="170" y2="27" strokeWidth="1.5" />
                      <rect x="140" y="80"  width="12" height="50" rx="3" fill="white" fillOpacity="0.2"  strokeWidth="0" />
                      <rect x="158" y="60"  width="12" height="70" rx="3" fill="white" fillOpacity="0.25" strokeWidth="0" />
                      <rect x="176" y="70"  width="12" height="60" rx="3" fill="white" fillOpacity="0.15" strokeWidth="0" />
                      <rect x="194" y="50"  width="12" height="80" rx="3" fill="white" fillOpacity="0.3"  strokeWidth="0" />
                      <line x1="136" y1="132" x2="216" y2="132" strokeWidth="1.5" />
                    </g>

                    {/* ── Analytics / line chart (right) ── */}
                    <g opacity="0.18">
                      <rect x="252" y="30" width="72" height="90" rx="6" strokeWidth="2" />
                      <polyline points="264,104 276,88 290,96 304,72 316,58" strokeWidth="2" fill="none" />
                      <circle cx="264" cy="104" r="3" fill="white" fillOpacity="0.4" strokeWidth="0" />
                      <circle cx="290" cy="96"  r="3" fill="white" fillOpacity="0.4" strokeWidth="0" />
                      <circle cx="316" cy="58"  r="3" fill="white" fillOpacity="0.4" strokeWidth="0" />
                      <line x1="260" y1="90" x2="320" y2="90" strokeWidth="1" strokeDasharray="4 3" />
                      <line x1="260" y1="76" x2="320" y2="76" strokeWidth="1" strokeDasharray="4 3" />
                    </g>

                    {/* ── Growth arrow ── */}
                    <g opacity="0.22">
                      <path d="M148 186 C168 180, 188 172, 208 158" strokeWidth="2.5" />
                      <polyline points="200,152 208,158 202,166" strokeWidth="2.5" />
                      <circle cx="143" cy="188" r="4" fill="white" fillOpacity="0.3" strokeWidth="0" />
                    </g>

                    {/* ── AI / brain nodes ── */}
                    <g opacity="0.13">
                      <circle cx="64"  cy="172" r="12" strokeWidth="1.5" />
                      <circle cx="96"  cy="185" r="8"  strokeWidth="1.5" />
                      <circle cx="46"  cy="190" r="6"  strokeWidth="1.5" />
                      <line x1="64" y1="172" x2="96"  y2="185" strokeWidth="1.2" />
                      <line x1="64" y1="172" x2="46"  y2="190" strokeWidth="1.2" />
                      <line x1="96" y1="185" x2="46"  y2="190" strokeWidth="1.2" />
                      <circle cx="64" cy="172" r="3" fill="white" fillOpacity="0.25" strokeWidth="0" />
                    </g>

                    {/* ── Match score ring ── */}
                    <g opacity="0.16">
                      <circle cx="296" cy="180" r="28" strokeWidth="2" strokeDasharray="5 3" />
                      <circle cx="296" cy="180" r="20" strokeWidth="2" />
                      <line x1="296" y1="164" x2="296" y2="172" strokeWidth="2" />
                      <line x1="296" y1="188" x2="296" y2="196" strokeWidth="2" />
                      <line x1="280" y1="180" x2="288" y2="180" strokeWidth="2" />
                      <line x1="304" y1="180" x2="312" y2="180" strokeWidth="2" />
                      <path d="M296 160 a20 20 0 0 1 17.3 10" strokeWidth="3" />
                    </g>

                    {/* ── Connecting dotted lines ── */}
                    <g opacity="0.1">
                      <line x1="108" y1="87" x2="126" y2="87" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="234" y1="75" x2="252" y2="75" strokeWidth="1.5" strokeDasharray="4 3" />
                    </g>
                  </svg>
                </div>

                {/* Subtle divider */}
                <div className="border-t border-white/10 mb-4 flex-shrink-0" />

                {/* 5. Compact feature checklist — 2 columns to stay trim */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-shrink-0">
                  {[
                    "Resume Analysis",
                    "Skill Matching",
                    "Gap Detection",
                    "Learning Roadmap",
                    "Recommendations",
                  ].map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-blue-100">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Input Forms ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Job Description card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Job Description</p>
                    <p className="text-[11px] text-gray-400">Paste text or upload a document</p>
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                  {(["paste", "upload"] as JDInputMode[]).map((mode) => (
                    <button key={mode} id={`jd-${mode}-tab`}
                      onClick={() => setJdInputMode(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        jdInputMode === mode ? "bg-white text-[#0880EF] shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      {mode === "paste" ? "Paste Text" : "Upload File"}
                    </button>
                  ))}
                </div>
              </div>

              {jdInputMode === "paste" && (
                <div className="relative">
                  <textarea id="role-description"
                    className="w-full resize-none text-sm text-gray-600 placeholder-gray-400 outline-none min-h-[170px] leading-relaxed border border-gray-200 rounded-xl p-3.5 focus:border-[#0880EF] focus:ring-1 focus:ring-[#0880EF] transition-colors"
                    placeholder="Paste internship or job description here..."
                    maxLength={2000} value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)} />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400">
                    {roleDescription.length} / 2000
                  </span>
                </div>
              )}

              {jdInputMode === "upload" && (
                <div>
                  <div id="jd-upload-zone"
                    className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer p-6 flex flex-col items-center justify-center text-center min-h-[170px]
                      ${isJdDragging ? "border-[#0880EF] bg-blue-50" : "border-gray-200 hover:border-[#0880EF] hover:bg-gray-50"}`}
                    onDrop={handleJdDrop} onDragOver={handleJdDragOver} onDragLeave={handleJdDragLeave}
                    onClick={() => !jdFile && jdFileInputRef.current?.click()}>
                    <input ref={jdFileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden"
                      onChange={(e) => handleJdFileSelect(e.target.files?.[0] ?? null)} />
                    {jdFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-green-700">{jdFile.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{(jdFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveJdFile(); }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Upload Job Description</p>
                        <p className="text-xs text-gray-400">PDF, DOCX, or TXT · Drag & drop or <span className="text-[#0880EF] font-medium">browse</span></p>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 text-center">
                    Uploaded file takes priority over pasted text
                  </p>
                </div>
              )}
            </div>

            {/* Resume upload card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Resume Upload</p>
                  <p className="text-[11px] text-gray-400">PDF, DOC, DOCX, or TXT · Max 5 MB</p>
                </div>
              </div>

              <div id="resume-upload-zone"
                className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer p-6 flex flex-col items-center justify-center text-center
                  ${isDragging ? "border-[#0880EF] bg-blue-50" : "border-gray-200 hover:border-[#0880EF] hover:bg-gray-50"}`}
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)} />
                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-green-700">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Upload Your Resume</p>
                    <p className="text-xs text-gray-400">Drag & drop or <span className="text-[#0880EF] font-medium">browse files</span></p>
                  </>
                )}
              </div>
            </div>

            {/* Error */}
            {analysisError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-xs text-red-600 leading-relaxed">{analysisError}</p>
              </div>
            )}

            {/* Analyze button */}
            <button id="analyze-btn" disabled={!canAnalyze || isAnalyzing} onClick={handleAnalyze}
              className={`w-full py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2.5
                ${canAnalyze && !isAnalyzing
                  ? "bg-[#0880EF] hover:bg-[#0669cc] shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {isAnalyzing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Analyze Resume Match
                </>
              )}
            </button>

            {/* Input checklist pills */}
            {!canAnalyze && !isAnalyzing && (
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { done: hasJD,          label: "Job Description" },
                  { done: !!uploadedFile, label: "Resume File"     },
                ].map(({ done, label }) => (
                  <span key={label} className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    done ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}>
                    {done
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    }
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PHASE 3: Loading overlay
        ══════════════════════════════════════════════ */}
        {isAnalyzing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-5 bg-white rounded-3xl shadow-2xl border border-gray-100 px-10 py-10">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#0880EF] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-[#0880EF] border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: "0.7s", animationDirection: "reverse" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-800">Analyzing your resume…</p>
                <p className="text-sm text-gray-400 mt-1">Extracting skills and matching requirements</p>
              </div>
              <div className="flex flex-col gap-2 w-56">
                {[
                  { label: "Reading resume",         delay: "0s"    },
                  { label: "Extracting skills",      delay: "0.15s" },
                  { label: "Matching requirements",  delay: "0.3s"  },
                  { label: "Generating roadmap",     delay: "0.45s" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0880EF] animate-bounce flex-shrink-0"
                      style={{ animationDelay: s.delay }} />
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RESULTS — Phases 4–10
            All calculations are preserved. Only the presentation changed.
        ══════════════════════════════════════════════════════════════════ */}
        {isAnalyzed && analysisResult && (
          <div ref={resultsRef} className="space-y-6 scroll-mt-6">

            {/* ── Results header banner ── */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">Analysis Complete</span>
                <span className="text-green-500 text-xs font-bold">✓</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* ── PHASE 4: Summary stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  value: `${analysisResult.matchScore}%`,
                  label: "Match Score",
                  sub: analysisResult.matchScore >= 80 ? "Excellent" : analysisResult.matchScore >= 60 ? "Good" : analysisResult.matchScore >= 40 ? "Fair" : "Low",
                  color: "text-[#0880EF]",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                },
                {
                  value: String(analysisResult.matchedSkills.length),
                  label: "Matched Skills",
                  sub: `of ${analysisResult.requiredSkills.length} required`,
                  color: "text-green-600",
                  bg: "bg-green-50",
                  border: "border-green-100",
                },
                {
                  value: String(analysisResult.missingSkills.length),
                  label: "Missing Skills",
                  sub: `${highMissing.length} high priority`,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                  border: "border-orange-100",
                },
                {
                  value: analysisResult.readinessLevel,
                  label: "Readiness",
                  sub: "Current level",
                  color: analysisResult.readinessLevel === "Job Ready" ? "text-green-600"
                    : analysisResult.readinessLevel === "Intermediate" ? "text-blue-600"
                    : analysisResult.readinessLevel === "Developing" ? "text-yellow-600"
                    : "text-orange-600",
                  bg: analysisResult.readinessLevel === "Job Ready" ? "bg-green-50"
                    : analysisResult.readinessLevel === "Intermediate" ? "bg-blue-50"
                    : analysisResult.readinessLevel === "Developing" ? "bg-yellow-50"
                    : "bg-orange-50",
                  border: analysisResult.readinessLevel === "Job Ready" ? "border-green-100"
                    : analysisResult.readinessLevel === "Intermediate" ? "border-blue-100"
                    : analysisResult.readinessLevel === "Developing" ? "border-yellow-100"
                    : "border-orange-100",
                },
              ].map((card) => (
                <div key={card.label}
                  className={`${card.bg} border ${card.border} rounded-2xl p-4 flex flex-col items-center text-center`}>
                  <p className={`text-2xl font-extrabold ${card.color} leading-none mb-1`}>{card.value}</p>
                  <p className="text-xs font-semibold text-gray-700">{card.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* ── PHASE 7: Quick Insights ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Top missing */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🔥</span>
                  <p className="text-sm font-bold text-gray-800">Top Missing Skills</p>
                </div>
                {highMissing.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {highMissing.slice(0, 3).map((s, i) => (
                      <div key={s.name} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{s.name}</span>
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">HIGH</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No high-priority gaps detected.</p>
                )}
              </div>

              {/* Strongest skills */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">💪</span>
                  <p className="text-sm font-bold text-gray-800">Strongest Skills</p>
                </div>
                {analysisResult.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchedSkills.slice(0, 6).map((skill) => (
                      <span key={skill}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#0880EF] border border-blue-100">
                        {skill}
                      </span>
                    ))}
                    {analysisResult.matchedSkills.length > 6 && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                        +{analysisResult.matchedSkills.length - 6} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No matched skills detected.</p>
                )}
              </div>
            </div>

            {/* ── PHASES 5, 6, 8, 9: Main results grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* PHASE 5: Hero compatibility card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-5">
                <div className="flex items-center gap-2 self-start">
                  <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-gray-800">Compatibility</h2>
                </div>

                {/* Large circular score */}
                <CircularProgress percentage={analysisResult.matchScore} />

                {/* Readiness level badge */}
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${
                  analysisResult.readinessLevel ? readinessColor[analysisResult.readinessLevel] : ""
                }`}>
                  {analysisResult.readinessLevel}
                </span>

                {/* Matched / Required */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-green-700">{analysisResult.matchedSkills.length}</p>
                    <p className="text-[10px] text-green-600 font-semibold mt-0.5">Matched</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-orange-700">{analysisResult.missingSkills.length}</p>
                    <p className="text-[10px] text-orange-600 font-semibold mt-0.5">Missing</p>
                  </div>
                </div>

                {/* Top strength / growth area */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">Top Strength</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{analysisResult.topStrength}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">Growth Area</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{analysisResult.growthArea}</p>
                  </div>
                </div>
              </div>

              {/* PHASE 9: Learning roadmap timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-gray-800">Learning Roadmap</h2>
                </div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-4 bottom-4 w-px bg-gray-200" />
                  <div className="flex flex-col gap-6">
                    {analysisResult.roadmap.map((phase, idx) => (
                      <div key={phase.step} className="flex gap-4 relative">
                        {/* Step indicator */}
                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-2 text-xs font-bold transition-all
                          ${idx === 0
                            ? "bg-[#0880EF] border-[#0880EF] text-white shadow-md shadow-blue-200"
                            : idx === analysisResult.roadmap.length - 1
                            ? "bg-purple-500 border-purple-500 text-white"
                            : "bg-white border-gray-300 text-gray-500"}`}>
                          {phase.step}
                        </div>
                        <div className="flex-1 pb-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm leading-tight ${idx === 0 ? "text-gray-900" : "text-gray-600"}`}>
                              {phase.title}
                            </h3>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-relaxed mb-1.5">{phase.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-medium">⏱ {phase.duration}</span>
                            <DifficultyBadge difficulty={phase.difficulty} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: readiness ladder + recommendations */}
              <div className="flex flex-col gap-4">

                {/* Career readiness ladder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800">Career Readiness</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(["Job Ready", "Intermediate", "Developing", "Beginner"] as ReadinessLevel[]).map((level) => {
                      const active = analysisResult.readinessLevel === level;
                      const dotColor: Record<ReadinessLevel, string> = {
                        "Job Ready":    "bg-green-500",
                        "Intermediate": "bg-blue-500",
                        "Developing":   "bg-yellow-500",
                        "Beginner":     "bg-orange-400",
                      };
                      return (
                        <div key={level}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-gray-50 ring-1 ring-gray-200" : ""}`}>
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active ? dotColor[level] : "bg-gray-200"}`} />
                          <span className={`text-sm font-medium ${active ? "text-gray-800" : "text-gray-400"}`}>{level}</span>
                          {active && <span className="ml-auto text-[10px] font-bold bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">Current</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PHASE 8: Recommendations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800">Recommendations</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <div key={idx}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0 border border-gray-100">
                          {rec.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{rec.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{rec.subtitle}</p>
                          <div className="mt-1.5">
                            <ResourceTypeBadge type={rec.type} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── PHASE 6: Priority-grouped missing skills ── */}
            {analysisResult.missingSkills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-gray-800">Skill Gaps by Priority</h2>
                  <span className="ml-auto text-[10px] text-gray-400 font-medium">
                    {analysisResult.missingSkills.length} skill{analysisResult.missingSkills.length !== 1 ? "s" : ""} to acquire
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* High */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">🔴</span>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">High Priority</p>
                      <span className="ml-auto text-[10px] font-bold text-gray-400">{highMissing.length}</span>
                    </div>
                    {highMissing.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {highMissing.map((s) => (
                          <div key={s.name}
                            className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">None</p>}
                  </div>

                  {/* Medium */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">🟡</span>
                      <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Medium Priority</p>
                      <span className="ml-auto text-[10px] font-bold text-gray-400">{mediumMissing.length}</span>
                    </div>
                    {mediumMissing.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {mediumMissing.map((s) => (
                          <div key={s.name}
                            className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">None</p>}
                  </div>

                  {/* Low */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">🟢</span>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Low Priority</p>
                      <span className="ml-auto text-[10px] font-bold text-gray-400">{lowMissing.length}</span>
                    </div>
                    {lowMissing.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {lowMissing.map((s) => (
                          <div key={s.name}
                            className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">None</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── PHASE 10: Progress tracking ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Skill Progress Tracker</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Your development journey at a glance</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="sm:w-44 h-2 bg-gray-100 rounded-full overflow-hidden flex-1">
                    <div className="h-full bg-[#0880EF] rounded-full transition-all duration-700"
                      style={{ width: `${overallProgressPct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{overallProgressPct}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: "Completed",    skills: completedSkills,   dot: "bg-green-500", chip: "bg-green-100 text-green-700 border-green-200",  empty: "None yet"             },
                  { label: "In Progress",  skills: inProgressSkills,  dot: "bg-blue-500",  chip: "bg-blue-100 text-blue-700 border-blue-200",     empty: "Nothing in progress"  },
                  { label: "Remaining",    skills: remainingSkills,   dot: "bg-gray-300",  chip: "bg-gray-100 text-gray-500 border-gray-200",     empty: "All skills covered!"  },
                ].map(({ label, skills, dot, chip, empty }) => (
                  <div key={label}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {label} ({skills.length})
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0
                        ? skills.map((s) => (
                          <span key={s.name} className={`text-xs font-medium px-3 py-1 rounded-full border ${chip}`}>
                            {s.name}
                          </span>
                        ))
                        : <p className="text-xs text-gray-400">{empty}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

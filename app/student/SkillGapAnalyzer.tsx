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
  TypeScript:         { title: "TypeScript Fundamentals",    description: "Master static typing and interfaces for better code quality.",                      duration: "2 Weeks", difficulty: "Intermediate" },
  "Next.js":          { title: "Next.js Development",        description: "Explore Server Components and App Router in the modern framework.",                  duration: "3 Weeks", difficulty: "Intermediate" },
  React:              { title: "React Essentials",           description: "Learn hooks, context, and modern React patterns.",                                   duration: "3 Weeks", difficulty: "Intermediate" },
  Python:             { title: "Python Fundamentals",        description: "Core Python syntax, OOP, and standard library.",                                     duration: "2 Weeks", difficulty: "Beginner"      },
  Java:               { title: "Java Programming",           description: "Object-oriented design and Java ecosystem.",                                         duration: "3 Weeks", difficulty: "Intermediate" },
  Docker:             { title: "Docker Containerization",    description: "Package and deploy apps with Docker.",                                                duration: "1 Week",  difficulty: "Intermediate" },
  Kubernetes:         { title: "Kubernetes Orchestration",   description: "Scale containerized apps in production.",                                             duration: "2 Weeks", difficulty: "Advanced"     },
  AWS:                { title: "AWS Cloud Basics",           description: "Core AWS services and deployment patterns.",                                          duration: "3 Weeks", difficulty: "Intermediate" },
  Azure:              { title: "Azure Cloud Fundamentals",   description: "Microsoft Azure services and certification prep.",                                    duration: "3 Weeks", difficulty: "Intermediate" },
  "Machine Learning": { title: "Machine Learning Basics",    description: "Supervised & unsupervised learning algorithms.",                                      duration: "4 Weeks", difficulty: "Advanced"     },
  SQL:                { title: "SQL & Databases",            description: "Relational database design and complex queries.",                                     duration: "2 Weeks", difficulty: "Beginner"     },
  GraphQL:            { title: "GraphQL API Design",         description: "Schema design, resolvers, and client integration.",                                   duration: "2 Weeks", difficulty: "Intermediate" },
  MongoDB:            { title: "MongoDB NoSQL",              description: "Document modeling and aggregation pipelines.",                                        duration: "1 Week",  difficulty: "Beginner"     },
  Git:                { title: "Git Version Control",        description: "Branching strategies and team workflows.",                                            duration: "1 Week",  difficulty: "Beginner"     },
  "Node.js":          { title: "Node.js Backend",            description: "Server-side JavaScript and async programming.",                                       duration: "3 Weeks", difficulty: "Intermediate" },
  "Deep Learning":    { title: "Deep Learning",              description: "Neural networks, CNNs, RNNs and modern architectures.",                               duration: "6 Weeks", difficulty: "Advanced"     },
  LLMs:               { title: "LLM Development",            description: "Prompt engineering, fine-tuning, and deployment.",                                    duration: "3 Weeks", difficulty: "Advanced"     },
  RAG:                { title: "RAG Pipeline Development",   description: "Build retrieval-augmented generation systems.",                                       duration: "2 Weeks", difficulty: "Advanced"     },
};

const DEFAULT_PHASE: Omit<RoadmapTemplate, "title"> = {
  description: "Build practical skills through hands-on projects.",
  duration: "2 Weeks",
  difficulty: "Intermediate",
};

// ─── Analysis Engine Functions ────────────────────────────────────────────────

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
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    textParts.push(pageText);
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

async function extractResumeText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "txt") return extractTxtText(file);
  if (ext === "pdf") return extractPdfText(file);
  if (ext === "docx" || ext === "doc") return extractDocxText(file);
  throw new Error(`Unsupported file type: .${ext}`);
}

function extractSkills(text: string): string[] {
  if (!text.trim()) return [];
  return SKILL_PATTERNS
    .filter(({ regex }) => regex.test(text))
    .map(({ canonical }) => canonical);
}

function compareSkills(
  resumeSkills: string[],
  requiredSkills: string[]
): { matchedSkills: string[]; missingSkills: string[] } {
  const lowerResume = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of requiredSkills) {
    if (lowerResume.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
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
  if (index < Math.ceil(total / 3)) return "HIGH";
  if (index < Math.ceil((2 * total) / 3)) return "MEDIUM";
  return "LOW";
}

function generateRecommendations(missingSkillNames: string[]): Recommendation[] {
  const recs: Recommendation[] = [];
  for (const skill of missingSkillNames) {
    if (recs.length >= 3) break;
    const config = SKILL_RECOMMENDATION_MAP[skill];
    if (config) {
      recs.push({ type: config.type, title: config.title, subtitle: config.subtitle, icon: config.icon });
    } else {
      recs.push({ type: "COURSE", title: `Learn ${skill}`, subtitle: `Build proficiency in ${skill}`, icon: "🎓" });
    }
  }
  if (recs.length < 3 && missingSkillNames.length > 0) {
    recs.push({ type: "PROJECT", title: "Portfolio Project", subtitle: "Apply your skills in a real project", icon: "💻" });
  }
  return recs;
}

function generateRoadmap(missingSkillNames: string[], matchedSkillNames: string[]): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];
  const topMissing = missingSkillNames.slice(0, 3);
  for (let i = 0; i < topMissing.length; i++) {
    const skill = topMissing[i];
    const template = ROADMAP_TEMPLATES[skill];
    phases.push({
      step: i + 1,
      title: template?.title ?? `Learn ${skill}`,
      description: template?.description ?? DEFAULT_PHASE.description,
      duration: template?.duration ?? DEFAULT_PHASE.duration,
      difficulty: template?.difficulty ?? DEFAULT_PHASE.difficulty,
    });
  }
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

async function performAnalysis(file: File, roleDescription: string): Promise<AnalysisResult> {
  const resumeText = await extractResumeText(file);
  if (!resumeText.trim()) {
    throw new Error("No text could be extracted from your resume. Please check the file.");
  }
  const detectedSkills = extractSkills(resumeText);
  const requiredSkills = extractSkills(roleDescription);
  if (requiredSkills.length === 0) {
    throw new Error("No recognizable skills found in the role description. Please include specific skill requirements.");
  }
  const { matchedSkills, missingSkills: missingSkillNames } = compareSkills(detectedSkills, requiredSkills);
  const missingSkills: MissingSkill[] = missingSkillNames.map((name, i) => ({
    name,
    priority: assignPriority(i, missingSkillNames.length),
  }));
  const matchScore = calculateMatchScore(matchedSkills, requiredSkills);
  const readinessLevel = getReadinessLevel(matchScore);
  const recommendations = generateRecommendations(missingSkillNames);
  const roadmap = generateRoadmap(missingSkillNames, matchedSkills);
  const skillProgress = buildSkillProgress(matchedSkills, missingSkillNames);
  const topStrength = deriveTopStrength(matchedSkills);
  const growthArea = deriveGrowthArea(missingSkillNames);
  return {
    matchScore, matchedSkills, missingSkills, recommendations, roadmap,
    readinessLevel, detectedSkills, requiredSkills, skillProgress, topStrength, growthArea,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="140" height="140" className="rotate-[-90deg]">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#0880EF" strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
        <span className="text-xs text-gray-500 mt-0.5">Match</span>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    HIGH: "bg-orange-500 text-white",
    MEDIUM: "bg-blue-100 text-blue-700",
    LOW: "bg-green-100 text-green-700",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const styles: Record<ResourceType, string> = {
    COURSE: "bg-blue-100 text-blue-600",
    CERTIFICATION: "bg-purple-100 text-purple-600",
    PROJECT: "bg-emerald-100 text-emerald-600",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${styles[type]}`}>
      {type}
    </span>
  );
}

function StatusChip({ status, name }: { status: ProgressStatus; name: string }) {
  const styles: Record<ProgressStatus, string> = {
    completed: "bg-green-100 text-green-700 border border-green-200",
    "in-progress": "bg-blue-100 text-blue-700 border border-blue-200",
    remaining: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status]}`}>
      {name}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SkillGapAnalyzer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [roleDescription, setRoleDescription] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canAnalyze = uploadedFile !== null && roleDescription.trim().length > 0;

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["pdf", "doc", "docx", "txt"];
    if (!ext || !allowedExts.includes(ext)) {
      setAnalysisError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setAnalysisError(null);
    setIsAnalyzed(false);
    setAnalysisResult(null);
    setUploadedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setIsAnalyzed(false);
    setAnalysisResult(null);
    setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!canAnalyze || !uploadedFile) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setIsAnalyzed(false);
    setAnalysisResult(null);
    try {
      const result = await performAnalysis(uploadedFile, roleDescription);
      setAnalysisResult(result);
      setIsAnalyzed(true);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completedSkills   = analysisResult?.skillProgress.filter((s) => s.status === "completed")   ?? [];
  const inProgressSkills  = analysisResult?.skillProgress.filter((s) => s.status === "in-progress") ?? [];
  const remainingSkills   = analysisResult?.skillProgress.filter((s) => s.status === "remaining")   ?? [];
  const totalTracked      = analysisResult?.skillProgress.length ?? 1;
  const overallProgressPct = Math.round((completedSkills.length / totalTracked) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0880EF] mb-1">Skill Gap Analyzer</h1>
          <p className="text-gray-500 text-sm">
            Compare your resume against internship requirements and identify targeted areas for professional growth.
          </p>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Job Description */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</p>
              </div>
              <span className="text-xs text-gray-400">{roleDescription.length} / 2000</span>
            </div>
            <textarea
              id="role-description"
              className="flex-1 resize-none text-sm text-gray-600 placeholder-gray-400 outline-none min-h-[200px] leading-relaxed"
              placeholder="Paste internship or job description here..."
              maxLength={2000}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
            />
          </div>

          {/* Resume Upload */}
          <div className="flex flex-col gap-4">
            <div
              id="resume-upload-zone"
              className={`bg-white rounded-2xl shadow-sm border-2 border-dashed transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center flex-1
                ${isDragging ? "border-[#0880EF] bg-blue-50" : "border-gray-200 hover:border-[#0880EF]"}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#0880EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700 mb-1">Upload Resume</p>
              <p className="text-xs text-gray-400 mb-4">PDF, DOC, DOCX, TXT (Max 5MB)</p>
              {uploadedFile ? (
                <div className="w-full max-w-xs flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-green-700 font-medium flex-1 truncate text-left">{uploadedFile.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Drag &amp; drop or <span className="text-[#0880EF] font-medium">browse files</span>
                </p>
              )}
            </div>

            {analysisError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-xs text-red-600 leading-relaxed">{analysisError}</p>
              </div>
            )}

            <button
              id="analyze-btn"
              disabled={!canAnalyze || isAnalyzing}
              onClick={handleAnalyze}
              className={`w-full py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2
                ${canAnalyze && !isAnalyzing
                  ? "bg-[#0880EF] hover:bg-[#0669cc] shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing...
                </>
              ) : "Analyze Resume Match"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {isAnalyzed && analysisResult && (
          <div className="space-y-6">

            {/* Row 1: Score | Roadmap | Readiness+Recs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Compatibility Score */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compatibility Score</p>

                <div className="flex justify-center relative">
                  <CircularProgress percentage={analysisResult.matchScore} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">Keywords</p>
                    <p className="text-lg font-bold text-gray-800">
                      {analysisResult.matchedSkills.length}/{analysisResult.requiredSkills.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">Readiness</p>
                    <p className="text-lg font-bold text-gray-800">{analysisResult.readinessLevel}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matched Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.matchedSkills.length > 0 ? (
                      analysisResult.matchedSkills.map((skill) => (
                        <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#0880EF] border border-blue-100">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No matching skills detected.</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Missing Skills</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {analysisResult.missingSkills.length > 0 ? (
                      analysisResult.missingSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                          <PriorityBadge priority={skill.priority} />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-green-600 font-medium">🎉 All required skills matched!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-800 mb-5">Learning Roadmap</h2>
                <div className="relative">
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />
                  <div className="flex flex-col gap-7">
                    {analysisResult.roadmap.map((phase, idx) => (
                      <div key={phase.step} className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 relative border-2
                            ${idx === 0 ? "bg-[#0880EF] border-[#0880EF]" : "bg-white border-gray-300"}`}>
                            {idx === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="flex-1 pb-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Step {phase.step}</p>
                          <h3 className={`font-semibold mb-1 ${idx === 0 ? "text-gray-800 text-base" : "text-gray-500 text-sm"}`}>
                            {phase.title}
                          </h3>
                          {idx === 0 && (
                            <p className="text-xs text-gray-500 mb-2 leading-relaxed">{phase.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium">⏱ {phase.duration}</span>
                            <DifficultyBadge difficulty={phase.difficulty} />
                          </div>
                          {idx !== 0 && (
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{phase.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Readiness + AI Recommendations */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Career Readiness</p>
                  <div className="flex flex-col gap-3">
                    {(["Job Ready", "Intermediate", "Developing", "Beginner"] as ReadinessLevel[]).map((level) => {
                      const active = analysisResult.readinessLevel === level;
                      const colors: Record<ReadinessLevel, string> = {
                        "Job Ready":    "bg-green-500",
                        "Intermediate": "bg-blue-500",
                        "Developing":   "bg-yellow-500",
                        "Beginner":     "bg-orange-400",
                      };
                      return (
                        <div key={level} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-gray-50" : ""}`}>
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active ? colors[level] : "bg-gray-200"}`} />
                          <span className={`text-sm font-medium ${active ? "text-gray-800" : "text-gray-400"}`}>{level}</span>
                          {active && (
                            <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">Current</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 mb-1">Top Strength</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{analysisResult.topStrength}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 mb-1">Growth Area</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{analysisResult.growthArea}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">AI Recommendations</p>
                  <div className="flex flex-col gap-3">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0">
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

            {/* Progress Tracking */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-800">Progress Tracking</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your skill development journey at a glance</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 sm:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0880EF] rounded-full transition-all duration-700"
                      style={{ width: `${overallProgressPct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{overallProgressPct}% complete</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Completed ({completedSkills.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {completedSkills.length > 0 ? (
                      completedSkills.map((s) => <StatusChip key={s.name} status={s.status} name={s.name} />)
                    ) : (
                      <p className="text-xs text-gray-400">None yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      In Progress ({inProgressSkills.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inProgressSkills.length > 0 ? (
                      inProgressSkills.map((s) => <StatusChip key={s.name} status={s.status} name={s.name} />)
                    ) : (
                      <p className="text-xs text-gray-400">Nothing in progress</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Remaining ({remainingSkills.length})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {remainingSkills.length > 0 ? (
                      remainingSkills.map((s) => <StatusChip key={s.name} status={s.status} name={s.name} />)
                    ) : (
                      <p className="text-xs text-gray-400">All skills covered!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export interface PersonalInfo {
  name: string;
  email: string;
  title: string;
  phone: string;
  location: string;
  avatar: string;
  premiumStatus: boolean;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  duration: string;
  gpa: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  date: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface StudentProfile {
  personalInfo: PersonalInfo;
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  experience: WorkExperience[];
  resumeText: string;
}

export type ApplicationStage = "Applied" | "Under Review" | "Shortlisted" | "Interview Scheduled" | "Selected" | "Rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  stage: ApplicationStage;
  dateApplied: string;
  notes?: string;
  link?: string;
}

export interface ATSAnalysis {
  overallScore: number;
  compatibilityCheck: string;
  keywordAnalysis: {
    matchedKeywords: string[];
    missingKeywords: string[];
    comparisonText: string;
  };
  suggestions: string[];
  industryBenchmarking: {
    percentile: number;
    benchmarkingText: string;
    matchingIndex: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface RoadmapStage {
  stageName: string;
  duration: string;
  skillsToLearn: string[];
  projectsToBuild: string[];
  estimatedHours: number;
}

export interface SkillGapRoadmap {
  roleName: string;
  matchingScore: number;
  currentSkillsAssessment: string;
  missingSkills: string[];
  roadmapStages: RoadmapStage[];
  recommendations: string[];
  internshipGuidance: string;
}

export interface CuratorJob {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  bgLogo?: string;
  location: string;
  duration?: string;
  salary: string;
  equity?: string;
  type: string;
  tags: string[];
  link: string;
  isNew?: boolean;
}

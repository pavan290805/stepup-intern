import { Schema, model, models, type Model } from "mongoose";

export interface IEducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startYear: number;
  endYear: number | null;
}

export interface IExperienceEntry {
  title: string;
  organization: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
}

export interface IStudentProfile {
  userId: Schema.Types.ObjectId;
  fullName: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  education: IEducationEntry[];
  experience: IExperienceEntry[];
  resumeIds: Schema.Types.ObjectId[];
  activeResumeId: Schema.Types.ObjectId | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  avatarUrl: string | null;
  resumeScore: number | null;
  savedInternshipIds: Schema.Types.ObjectId[];
  subscriptionTier: "free" | "premium";
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducationEntry>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, default: null },
    startYear: { type: Number, required: true },
    endYear: { type: Number, default: null },
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperienceEntry>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
  },
  { _id: false }
);

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, default: null },
    bio: { type: String, default: null },
    skills: { type: [String], default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    resumeIds: { type: [Schema.Types.ObjectId], ref: "Resume", default: [] },
    activeResumeId: { type: Schema.Types.ObjectId, ref: "Resume", default: null },
    githubUrl: { type: String, default: null },
    linkedinUrl: { type: String, default: null },
    portfolioUrl: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    resumeScore: { type: Number, default: null },
    savedInternshipIds: { type: [Schema.Types.ObjectId], ref: "Internship", default: [] },
    subscriptionTier: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
);

studentProfileSchema.index({ userId: 1 }, { unique: true });
studentProfileSchema.index({ skills: 1 });

export const StudentProfileModel: Model<IStudentProfile> =
  models.StudentProfile ?? model<IStudentProfile>("StudentProfile", studentProfileSchema);

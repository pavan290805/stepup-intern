import { Schema, model, models, type Model } from "mongoose";

export interface IResumeAiAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  analyzedAt: Date;
  provider: string;
}

export interface IResume {
  studentId: Schema.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  cloudinaryPublicId: string;
  version: number;
  parsedText: string | null;
  aiAnalysis: IResumeAiAnalysis | null;
  createdAt: Date;
  updatedAt: Date;
}

const aiAnalysisSchema = new Schema<IResumeAiAnalysis>(
  {
    score: { type: Number, required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    analyzedAt: { type: Date, required: true },
    provider: { type: String, required: true },
  },
  { _id: false }
);

const resumeSchema = new Schema<IResume>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    version: { type: Number, required: true, default: 1 },
    parsedText: { type: String, default: null },
    aiAnalysis: { type: aiAnalysisSchema, default: null },
  },
  { timestamps: true }
);

resumeSchema.index({ studentId: 1, createdAt: -1 });

export const ResumeModel: Model<IResume> = models.Resume ?? model<IResume>("Resume", resumeSchema);

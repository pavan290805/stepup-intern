import { Schema, model, models, type Model } from "mongoose";

export const INTERNSHIP_TYPES = ["internship", "full-time", "hybrid", "remote"] as const;
export type InternshipType = (typeof INTERNSHIP_TYPES)[number];

export const INTERNSHIP_STATUSES = ["draft", "published", "closed", "expired"] as const;
export type InternshipStatus = (typeof INTERNSHIP_STATUSES)[number];

export interface IInternship {
  recruiterId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  type: InternshipType;
  stipend: number | null;
  status: InternshipStatus;
  applicationDeadline: Date | null;
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    location: { type: String, required: true },
    type: { type: String, enum: INTERNSHIP_TYPES, required: true, default: "internship" },
    stipend: { type: Number, default: null },
    status: { type: String, enum: INTERNSHIP_STATUSES, default: "draft" },
    applicationDeadline: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

internshipSchema.index({ status: 1, location: 1, createdAt: -1 });
internshipSchema.index({ recruiterId: 1, status: 1 });
internshipSchema.index({ title: "text", description: "text", skillsRequired: "text" });

export const InternshipModel: Model<IInternship> =
  models.Internship ?? model<IInternship>("Internship", internshipSchema);

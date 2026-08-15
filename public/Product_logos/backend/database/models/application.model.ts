import { Schema, model, models, type Model } from "mongoose";

export const APPLICATION_STATUSES = [
  "applied",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface IApplicationTimelineEntry {
  status: ApplicationStatus;
  changedAt: Date;
  note: string | null;
}

export interface IApplication {
  studentId: Schema.Types.ObjectId;
  internshipId: Schema.Types.ObjectId;
  recruiterId: Schema.Types.ObjectId;
  resumeId: Schema.Types.ObjectId;
  status: ApplicationStatus;
  aiMatchScore: number | null;
  coverNote: string | null;
  timeline: IApplicationTimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const timelineSchema = new Schema<IApplicationTimelineEntry>(
  {
    status: { type: String, enum: APPLICATION_STATUSES, required: true },
    changedAt: { type: Date, required: true, default: () => new Date() },
    note: { type: String, default: null },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    internshipId: { type: Schema.Types.ObjectId, ref: "Internship", required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: "applied" },
    aiMatchScore: { type: Number, default: null },
    coverNote: { type: String, default: null },
    timeline: { type: [timelineSchema], default: [] },
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });
applicationSchema.index({ internshipId: 1, status: 1 });
applicationSchema.index({ recruiterId: 1, status: 1 });

export const ApplicationModel: Model<IApplication> =
  models.Application ?? model<IApplication>("Application", applicationSchema);

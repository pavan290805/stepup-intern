import { Schema, model, models, type Model } from "mongoose";

export const INTERVIEW_MODES = ["online", "onsite"] as const;
export type InterviewMode = (typeof INTERVIEW_MODES)[number];

export const INTERVIEW_STATUSES = ["scheduled", "completed", "cancelled"] as const;
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export interface IInterview {
  applicationId: Schema.Types.ObjectId;
  recruiterId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  scheduledAt: Date;
  mode: InterviewMode;
  status: InterviewStatus;
  meetingLink: string | null;
  location: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: INTERVIEW_MODES, required: true },
    status: { type: String, enum: INTERVIEW_STATUSES, default: "scheduled" },
    meetingLink: { type: String, default: null },
    location: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

interviewSchema.index({ applicationId: 1 });
interviewSchema.index({ recruiterId: 1, scheduledAt: 1 });

export const InterviewModel: Model<IInterview> = models.Interview ?? model<IInterview>("Interview", interviewSchema);

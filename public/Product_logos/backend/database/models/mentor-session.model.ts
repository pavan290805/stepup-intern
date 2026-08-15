import { Schema, model, models, type Model } from "mongoose";

export const MENTOR_SESSION_STATUSES = ["requested", "confirmed", "completed", "cancelled"] as const;
export type MentorSessionStatus = (typeof MENTOR_SESSION_STATUSES)[number];

export interface IMentorSession {
  mentorId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  topic: string;
  status: MentorSessionStatus;
  meetingLink: string | null;
  pointsAwarded: number;
  rating: number | null;
  review: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const mentorSessionSchema = new Schema<IMentorSession>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    topic: { type: String, required: true, maxlength: 200 },
    status: { type: String, enum: MENTOR_SESSION_STATUSES, default: "requested" },
    meetingLink: { type: String, default: null },
    pointsAwarded: { type: Number, default: 0 },
    rating: { type: Number, default: null, min: 1, max: 5 },
    review: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mentorSessionSchema.index({ mentorId: 1, scheduledAt: -1 });
mentorSessionSchema.index({ studentId: 1, scheduledAt: -1 });
mentorSessionSchema.index({ status: 1 });

export const MentorSessionModel: Model<IMentorSession> =
  models.MentorSession ?? model<IMentorSession>("MentorSession", mentorSessionSchema);

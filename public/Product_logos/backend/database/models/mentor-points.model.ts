import { Schema, model, models, type Model } from "mongoose";

export interface IMentorPointsLedgerEntry {
  mentorId: Schema.Types.ObjectId;
  sessionId: Schema.Types.ObjectId | null;
  points: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const mentorPointsLedgerSchema = new Schema<IMentorPointsLedgerEntry>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "MentorSession", default: null },
    points: { type: Number, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

mentorPointsLedgerSchema.index({ mentorId: 1, createdAt: -1 });

export const MentorPointsLedgerModel: Model<IMentorPointsLedgerEntry> =
  models.MentorPointsLedger ?? model<IMentorPointsLedgerEntry>("MentorPointsLedger", mentorPointsLedgerSchema);

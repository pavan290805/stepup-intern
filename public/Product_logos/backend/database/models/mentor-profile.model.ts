import { Schema, model, models, type Model } from "mongoose";

export interface IMentorProfile {
  userId: Schema.Types.ObjectId;
  fullName: string;
  headline: string | null;
  bio: string | null;
  expertiseAreas: string[];
  yearsOfExperience: number | null;
  totalPoints: number;
  averageRating: number;
  totalReviews: number;
  isAcceptingSessions: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mentorProfileSchema = new Schema<IMentorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, default: null },
    bio: { type: String, default: null },
    expertiseAreas: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: null },
    totalPoints: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isAcceptingSessions: { type: Boolean, default: true },
  },
  { timestamps: true }
);

mentorProfileSchema.index({ userId: 1 }, { unique: true });
mentorProfileSchema.index({ expertiseAreas: 1 });

export const MentorProfileModel: Model<IMentorProfile> =
  models.MentorProfile ?? model<IMentorProfile>("MentorProfile", mentorProfileSchema);

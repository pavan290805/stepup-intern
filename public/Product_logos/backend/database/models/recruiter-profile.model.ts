import { Schema, model, models, type Model } from "mongoose";

export interface IRecruiterProfile {
  userId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId | null;
  fullName: string;
  designation: string | null;
  verified: boolean;
  subscriptionTier: "free" | "premium";
  createdAt: Date;
  updatedAt: Date;
}

const recruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null },
    fullName: { type: String, required: true, trim: true },
    designation: { type: String, default: null },
    verified: { type: Boolean, default: false },
    subscriptionTier: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
);

recruiterProfileSchema.index({ userId: 1 }, { unique: true });
recruiterProfileSchema.index({ companyId: 1 });

export const RecruiterProfileModel: Model<IRecruiterProfile> =
  models.RecruiterProfile ?? model<IRecruiterProfile>("RecruiterProfile", recruiterProfileSchema);

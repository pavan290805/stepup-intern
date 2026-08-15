import { Schema, model, models, type Model } from "mongoose";

export interface IInvestorProfile {
  userId: Schema.Types.ObjectId;
  fullName: string;
  firmName: string | null;
  bio: string | null;
  investmentInterests: string[];
  minTicketSizeInPaise: number | null;
  maxTicketSizeInPaise: number | null;
  verified: boolean;
  savedStartupIds: Schema.Types.ObjectId[];
  subscriptionTier: "free" | "premium";
  createdAt: Date;
  updatedAt: Date;
}

const investorProfileSchema = new Schema<IInvestorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    firmName: { type: String, default: null },
    bio: { type: String, default: null },
    investmentInterests: { type: [String], default: [] },
    minTicketSizeInPaise: { type: Number, default: null },
    maxTicketSizeInPaise: { type: Number, default: null },
    verified: { type: Boolean, default: false },
    savedStartupIds: { type: [Schema.Types.ObjectId], ref: "Startup", default: [] },
    subscriptionTier: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
);

investorProfileSchema.index({ userId: 1 }, { unique: true });

export const InvestorProfileModel: Model<IInvestorProfile> =
  models.InvestorProfile ?? model<IInvestorProfile>("InvestorProfile", investorProfileSchema);

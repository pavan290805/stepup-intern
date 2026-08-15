import { Schema, model, models, type Model } from "mongoose";

export const STARTUP_STAGES = ["idea", "pre-seed", "seed", "series-a", "series-b-plus", "growth"] as const;
export type StartupStage = (typeof STARTUP_STAGES)[number];

export interface IStartup {
  founderId: Schema.Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: StartupStage;
  fundingRaisedInPaise: number;
  seekingInvestmentInPaise: number | null;
  website: string | null;
  logoUrl: string | null;
  isPubliclyListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const startupSchema = new Schema<IStartup>(
  {
    founderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { type: String, enum: STARTUP_STAGES, required: true },
    fundingRaisedInPaise: { type: Number, default: 0 },
    seekingInvestmentInPaise: { type: Number, default: null },
    website: { type: String, default: null },
    logoUrl: { type: String, default: null },
    isPubliclyListed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

startupSchema.index({ isPubliclyListed: 1, stage: 1, industry: 1 });
startupSchema.index({ founderId: 1 });
startupSchema.index({ name: "text", tagline: "text", description: "text" });

export const StartupModel: Model<IStartup> = models.Startup ?? model<IStartup>("Startup", startupSchema);

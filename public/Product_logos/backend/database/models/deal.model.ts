import { Schema, model, models, type Model } from "mongoose";

export const DEAL_STAGES = ["interested", "contacted", "diligence", "term-sheet", "invested", "passed"] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export interface IDeal {
  investorId: Schema.Types.ObjectId;
  startupId: Schema.Types.ObjectId;
  stage: DealStage;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    investorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startupId: { type: Schema.Types.ObjectId, ref: "Startup", required: true },
    stage: { type: String, enum: DEAL_STAGES, default: "interested" },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

dealSchema.index({ investorId: 1, startupId: 1 }, { unique: true });
dealSchema.index({ investorId: 1, stage: 1 });

export const DealModel: Model<IDeal> = models.Deal ?? model<IDeal>("Deal", dealSchema);

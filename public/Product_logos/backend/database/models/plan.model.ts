import { Schema, model, models, type Model } from "mongoose";
import { ROLES } from "@/shared/constants/roles";

export const PLAN_TIERS = ["free", "premium"] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];

export const BILLING_CYCLES = ["monthly", "yearly"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const PLAN_ROLES = [ROLES.STUDENT, ROLES.RECRUITER] as const;
export type PlanRole = (typeof PLAN_ROLES)[number];

export interface IPlan {
  key: string;
  name: string;
  role: PlanRole;
  tier: PlanTier;
  priceInPaise: number;
  billingCycle: BillingCycle | null;
  razorpayPlanId: string | null;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: PLAN_ROLES, required: true },
    tier: { type: String, enum: PLAN_TIERS, required: true },
    priceInPaise: { type: Number, required: true, default: 0 },
    billingCycle: { type: String, enum: BILLING_CYCLES, default: null },
    razorpayPlanId: { type: String, default: null },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

planSchema.index({ key: 1 }, { unique: true });
planSchema.index({ role: 1, tier: 1 });

export const PlanModel: Model<IPlan> = models.Plan ?? model<IPlan>("Plan", planSchema);

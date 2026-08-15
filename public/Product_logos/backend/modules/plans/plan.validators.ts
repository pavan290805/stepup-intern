import { z } from "zod";
import { PLAN_ROLES, PLAN_TIERS, BILLING_CYCLES } from "@/database/models/plan.model";

export const listPlansQuerySchema = z.object({
  role: z.enum(PLAN_ROLES).optional(),
});

export type ListPlansQuery = z.infer<typeof listPlansQuerySchema>;

export const createPlanSchema = z.object({
  key: z.string().min(3).max(60),
  name: z.string().min(2).max(120),
  role: z.enum(PLAN_ROLES),
  tier: z.enum(PLAN_TIERS),
  priceInPaise: z.number().int().nonnegative(),
  billingCycle: z.enum(BILLING_CYCLES).nullable().optional(),
  razorpayPlanId: z.string().nullable().optional(),
  features: z.array(z.string().min(1)).default([]),
});

export type CreatePlanDto = z.infer<typeof createPlanSchema>;

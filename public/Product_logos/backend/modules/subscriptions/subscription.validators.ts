import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const createSubscriptionSchema = z.object({
  planId: mongoIdSchema,
});

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;

export const changePlanSchema = z.object({
  planId: mongoIdSchema,
});

export type ChangePlanDto = z.infer<typeof changePlanSchema>;

export const cancelSubscriptionSchema = z.object({
  atPeriodEnd: z.boolean().default(true),
});

export type CancelSubscriptionDto = z.infer<typeof cancelSubscriptionSchema>;

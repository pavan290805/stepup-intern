import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const createCheckoutOrderSchema = z.object({
  planId: mongoIdSchema,
});

export type CreateCheckoutOrderDto = z.infer<typeof createCheckoutOrderSchema>;

export const paymentHistoryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaymentHistoryQuery = z.infer<typeof paymentHistoryQuerySchema>;

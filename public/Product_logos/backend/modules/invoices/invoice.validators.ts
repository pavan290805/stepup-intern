import { z } from "zod";

export const invoiceHistoryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type InvoiceHistoryQuery = z.infer<typeof invoiceHistoryQuerySchema>;

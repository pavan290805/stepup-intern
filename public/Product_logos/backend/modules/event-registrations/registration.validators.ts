import { z } from "zod";

export const registrationHistoryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
});

export type RegistrationHistoryQuery = z.infer<typeof registrationHistoryQuerySchema>;

export const markAttendanceSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),
});

export type MarkAttendanceDto = z.infer<typeof markAttendanceSchema>;

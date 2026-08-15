import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const upsertMentorProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  headline: z.string().max(150).optional(),
  bio: z.string().max(2000).optional(),
  expertiseAreas: z.array(z.string().min(1)).max(30).optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  isAcceptingSessions: z.boolean().optional(),
});

export type UpsertMentorProfileDto = z.infer<typeof upsertMentorProfileSchema>;

export const requestSessionSchema = z.object({
  mentorId: mongoIdSchema,
  scheduledAt: z.coerce.date(),
  durationMinutes: z.number().int().min(15).max(180).default(30),
  topic: z.string().min(3).max(200),
});

export type RequestSessionDto = z.infer<typeof requestSessionSchema>;

export const submitReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional(),
});

export type SubmitReviewDto = z.infer<typeof submitReviewSchema>;

export const sessionListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
});

export type SessionListQuery = z.infer<typeof sessionListQuerySchema>;

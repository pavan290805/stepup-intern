import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

/**
 * Accepts either a stored resumeId (uses its parsedText if the parsing
 * pipeline has populated it) or raw resumeText directly, since full resume
 * parsing is architecture-only in this phase (see Phase 2 scope: "Resume
 * Parser architecture"). This keeps the AI endpoint usable end-to-end today
 * without blocking on that pipeline.
 */
export const analyzeResumeSchema = z
  .object({
    resumeId: mongoIdSchema.optional(),
    resumeText: z.string().min(50).max(20_000).optional(),
    targetRole: z.string().max(150).optional(),
  })
  .refine((data) => Boolean(data.resumeId) || Boolean(data.resumeText), {
    message: "Either resumeId or resumeText must be provided",
  });

export type AnalyzeResumeDto = z.infer<typeof analyzeResumeSchema>;

export const generateJdSchema = z.object({
  roleTitle: z.string().min(2).max(150),
  companyDescription: z.string().max(2000).optional(),
  skillsRequired: z.array(z.string().min(1)).max(30).default([]),
  location: z.string().min(1).max(150),
  type: z.enum(["internship", "full-time", "hybrid", "remote"]).default("internship"),
});

export type GenerateJdDto = z.infer<typeof generateJdSchema>;

import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";
import { INTERNSHIP_TYPES } from "@/database/models/internship.model";

export const createInternshipSchema = z.object({
  companyId: mongoIdSchema,
  title: z.string().min(3).max(150),
  description: z.string().min(20).max(10_000),
  skillsRequired: z.array(z.string().min(1)).max(30).default([]),
  location: z.string().min(1).max(150),
  type: z.enum(INTERNSHIP_TYPES).default("internship"),
  stipend: z.number().nonnegative().nullable().optional(),
  applicationDeadline: z.coerce.date().nullable().optional(),
});

export type CreateInternshipDto = z.infer<typeof createInternshipSchema>;

export const updateInternshipSchema = createInternshipSchema.partial();

export type UpdateInternshipDto = z.infer<typeof updateInternshipSchema>;

export const internshipSearchQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  location: z.string().trim().max(150).optional(),
  type: z.enum(INTERNSHIP_TYPES).optional(),
  skills: z
    .string()
    .transform((value) => value.split(",").map((s) => s.trim()).filter(Boolean))
    .optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type InternshipSearchQuery = z.infer<typeof internshipSearchQuerySchema>;

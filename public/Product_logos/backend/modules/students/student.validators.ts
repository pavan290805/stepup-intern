import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

const educationEntrySchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(150),
  fieldOfStudy: z.string().max(150).optional(),
  startYear: z.number().int().min(1950).max(2100),
  endYear: z.number().int().min(1950).max(2100).optional(),
});

const experienceEntrySchema = z.object({
  title: z.string().min(1).max(150),
  organization: z.string().min(1).max(150),
  description: z.string().max(2000).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().default(false),
});

export const upsertStudentProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  headline: z.string().max(150).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string().min(1).max(50)).max(50).optional(),
  education: z.array(educationEntrySchema).max(20).optional(),
  experience: z.array(experienceEntrySchema).max(20).optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
});

export type UpsertStudentProfileDto = z.infer<typeof upsertStudentProfileSchema>;

export const saveInternshipSchema = z.object({
  internshipId: mongoIdSchema,
});

export type SaveInternshipDto = z.infer<typeof saveInternshipSchema>;

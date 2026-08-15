import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";
import { COMPANY_SIZE } from "@/database/models/company.model";
import { INTERVIEW_MODES } from "@/database/models/interview.model";
import { APPLICATION_STATUSES } from "@/database/models/application.model";

export const upsertRecruiterProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  designation: z.string().max(120).optional(),
});

export type UpsertRecruiterProfileDto = z.infer<typeof upsertRecruiterProfileSchema>;

export const createCompanySchema = z.object({
  name: z.string().min(2).max(150),
  website: z.string().url().optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(COMPANY_SIZE).optional(),
  description: z.string().max(5000).optional(),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema.partial();

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  note: z.string().max(1000).optional(),
});

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;

export const scheduleInterviewSchema = z.object({
  applicationId: mongoIdSchema,
  scheduledAt: z.coerce.date(),
  mode: z.enum(INTERVIEW_MODES),
  meetingLink: z.string().url().optional(),
  location: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
});

export type ScheduleInterviewDto = z.infer<typeof scheduleInterviewSchema>;

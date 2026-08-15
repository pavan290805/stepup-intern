import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";
import { STARTUP_STAGES } from "@/database/models/startup.model";
import { DEAL_STAGES } from "@/database/models/deal.model";

export const upsertInvestorProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  firmName: z.string().max(150).optional(),
  bio: z.string().max(2000).optional(),
  investmentInterests: z.array(z.string().min(1)).max(30).optional(),
  minTicketSizeInPaise: z.number().int().nonnegative().optional(),
  maxTicketSizeInPaise: z.number().int().nonnegative().optional(),
});

export type UpsertInvestorProfileDto = z.infer<typeof upsertInvestorProfileSchema>;

export const startupSearchQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  industry: z.string().max(100).optional(),
  stage: z.enum(STARTUP_STAGES).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type StartupSearchQuery = z.infer<typeof startupSearchQuerySchema>;

export const createStartupSchema = z.object({
  name: z.string().min(2).max(150),
  tagline: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  industry: z.string().min(1).max(100),
  stage: z.enum(STARTUP_STAGES),
  fundingRaisedInPaise: z.number().int().nonnegative().default(0),
  seekingInvestmentInPaise: z.number().int().nonnegative().nullable().optional(),
  website: z.string().url().optional(),
});

export type CreateStartupDto = z.infer<typeof createStartupSchema>;

export const saveStartupSchema = z.object({
  startupId: mongoIdSchema,
});

export type SaveStartupDto = z.infer<typeof saveStartupSchema>;

export const createDealSchema = z.object({
  startupId: mongoIdSchema,
  notes: z.string().max(2000).optional(),
});

export type CreateDealDto = z.infer<typeof createDealSchema>;

export const updateDealStageSchema = z.object({
  stage: z.enum(DEAL_STAGES),
  notes: z.string().max(2000).optional(),
});

export type UpdateDealStageDto = z.infer<typeof updateDealStageSchema>;

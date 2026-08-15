import type { NextRequest } from "next/server";
import { investorService } from "@/modules/investors/investor.service";
import {
  createDealSchema,
  createStartupSchema,
  saveStartupSchema,
  startupSearchQuerySchema,
  updateDealStageSchema,
  upsertInvestorProfileSchema,
} from "@/modules/investors/investor.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const investorController = {
  async getProfile(request: NextRequest, context: AuthContext) {
    const profile = await investorService.getProfile(context.user.id);
    return ApiResponse.success(profile, "Investor profile retrieved");
  },

  async upsertProfile(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = upsertInvestorProfileSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid profile payload", parsed.error.flatten());

    const profile = await investorService.upsertProfile(context.user.id, parsed.data);
    return ApiResponse.success(profile, "Investor profile saved");
  },

  async createStartup(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createStartupSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid startup payload", parsed.error.flatten());

    const startup = await investorService.createStartup(context.user.id, parsed.data);
    return ApiResponse.created(startup, "Startup listed");
  },

  async searchStartups(request: NextRequest) {
    const parsed = startupSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid search parameters", parsed.error.flatten());

    const result = await investorService.searchStartups(parsed.data);
    return ApiResponse.success(result, "Startups retrieved");
  },

  async getStartup(request: NextRequest, context: { params?: Record<string, string> }) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Startup id is required");

    const startup = await investorService.getStartup(id);
    return ApiResponse.success(startup, "Startup retrieved");
  },

  async saveStartup(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = saveStartupSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await investorService.saveStartup(context.user.id, parsed.data.startupId);
    return ApiResponse.success(result, "Startup saved");
  },

  async unsaveStartup(request: NextRequest, context: AuthContext) {
    const startupId = context.params?.id;
    if (!startupId) throw new ValidationError("Startup id is required");

    const result = await investorService.unsaveStartup(context.user.id, startupId);
    return ApiResponse.success(result, "Startup removed from saved list");
  },

  async getSavedStartups(request: NextRequest, context: AuthContext) {
    const result = await investorService.getSavedStartups(context.user.id);
    return ApiResponse.success(result, "Saved startups retrieved");
  },

  async addToDealPipeline(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createDealSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const deal = await investorService.addToDealPipeline(context.user.id, parsed.data);
    return ApiResponse.created(deal, "Startup added to deal pipeline");
  },

  async updateDealStage(request: NextRequest, context: AuthContext) {
    const dealId = context.params?.id;
    if (!dealId) throw new ValidationError("Deal id is required");

    const body = await parseJsonBody(request);
    const parsed = updateDealStageSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const deal = await investorService.updateDealStage(context.user.id, dealId, parsed.data);
    return ApiResponse.success(deal, "Deal stage updated");
  },

  async getDealPipeline(request: NextRequest, context: AuthContext) {
    const parsed = startupSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await investorService.getDealPipeline(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Deal pipeline retrieved");
  },

  async dashboard(request: NextRequest, context: AuthContext) {
    const result = await investorService.getDashboard(context.user.id);
    return ApiResponse.success(result, "Investor dashboard retrieved");
  },

  async analytics(request: NextRequest, context: AuthContext) {
    const result = await investorService.getAnalytics(context.user.id);
    return ApiResponse.success(result, "Investor analytics retrieved");
  },
};

import { investorRepository, startupRepository, dealRepository } from "@/modules/investors/investor.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type {
  CreateDealDto,
  CreateStartupDto,
  StartupSearchQuery,
  UpdateDealStageDto,
  UpsertInvestorProfileDto,
} from "@/modules/investors/investor.validators";

export const investorService = {
  async getProfile(userId: string) {
    const profile = await investorRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Investor profile not found. Complete your profile first.");
    }
    return profile;
  },

  async upsertProfile(userId: string, data: UpsertInvestorProfileDto) {
    return investorRepository.upsertProfile(userId, data);
  },

  async createStartup(founderId: string, data: CreateStartupDto) {
    return startupRepository.create(founderId, data);
  },

  async getStartup(startupId: string) {
    const startup = await startupRepository.findById(startupId);
    if (!startup || !startup.isPubliclyListed) {
      throw new NotFoundError("Startup not found");
    }
    return startup;
  },

  async searchStartups(query: StartupSearchQuery) {
    const results = await startupRepository.search(
      { industry: query.industry, stage: query.stage, textQuery: query.q },
      query.cursor,
      query.limit
    );
    return buildPaginatedResult(results, query.limit);
  },

  async saveStartup(userId: string, startupId: string) {
    const startup = await startupRepository.findById(startupId);
    if (!startup) {
      throw new NotFoundError("Startup not found");
    }
    return investorRepository.saveStartup(userId, startupId);
  },

  async unsaveStartup(userId: string, startupId: string) {
    return investorRepository.unsaveStartup(userId, startupId);
  },

  async getSavedStartups(userId: string) {
    const profile = await investorRepository.findProfileByUserId(userId);
    if (!profile || profile.savedStartupIds.length === 0) return [];
    return startupRepository.findByIds(profile.savedStartupIds.map(String));
  },

  async addToDealPipeline(investorId: string, data: CreateDealDto) {
    const startup = await startupRepository.findById(data.startupId);
    if (!startup) {
      throw new NotFoundError("Startup not found");
    }

    const existing = await dealRepository.findByInvestorAndStartup(investorId, data.startupId);
    if (existing) {
      throw new ConflictError("This startup is already in your deal pipeline");
    }

    return dealRepository.create(investorId, data.startupId, data.notes);
  },

  async updateDealStage(investorId: string, dealId: string, data: UpdateDealStageDto) {
    const deal = await dealRepository.findById(dealId);
    if (!deal || String(deal.investorId) !== investorId) {
      throw new NotFoundError("Deal not found");
    }
    return dealRepository.updateStage(dealId, data.stage, data.notes);
  },

  async getDealPipeline(investorId: string, cursor: string | undefined, limit: number, stage?: string) {
    const results = await dealRepository.findByInvestor(investorId, cursor, limit, stage);
    return buildPaginatedResult(results, limit);
  },

  async getDashboard(investorId: string) {
    const [profile, pipeline] = await Promise.all([
      investorRepository.findProfileByUserId(investorId),
      dealRepository.findByInvestor(investorId, undefined, 200),
    ]);

    const stageCounts = pipeline.reduce<Record<string, number>>((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] ?? 0) + 1;
      return acc;
    }, {});

    return {
      savedStartupCount: profile?.savedStartupIds.length ?? 0,
      totalDealsInPipeline: pipeline.length,
      dealsByStage: stageCounts,
      subscriptionTier: profile?.subscriptionTier ?? "free",
    };
  },

  async getAnalytics(investorId: string) {
    const pipeline = await dealRepository.findByInvestor(investorId, undefined, 500);
    const invested = pipeline.filter((d) => d.stage === "invested").length;
    const total = pipeline.length;

    return {
      totalDeals: total,
      investedCount: invested,
      conversionRate: total > 0 ? Number((invested / total).toFixed(2)) : 0,
    };
  },
};

export type InvestorService = typeof investorService;

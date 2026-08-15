import { InvestorProfileModel } from "@/database/models/investor-profile.model";
import { StartupModel, type StartupStage } from "@/database/models/startup.model";
import { DealModel, type DealStage } from "@/database/models/deal.model";
import type { CreateStartupDto, UpsertInvestorProfileDto } from "@/modules/investors/investor.validators";

export const investorRepository = {
  async findProfileByUserId(userId: string) {
    return InvestorProfileModel.findOne({ userId }).lean().exec();
  },

  async upsertProfile(userId: string, data: UpsertInvestorProfileDto) {
    return InvestorProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async saveStartup(userId: string, startupId: string) {
    return InvestorProfileModel.findOneAndUpdate(
      { userId },
      { $addToSet: { savedStartupIds: startupId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async unsaveStartup(userId: string, startupId: string) {
    return InvestorProfileModel.findOneAndUpdate({ userId }, { $pull: { savedStartupIds: startupId } }, { new: true })
      .lean()
      .exec();
  },
};

export const startupRepository = {
  async create(founderId: string, data: CreateStartupDto) {
    const startup = await StartupModel.create({ ...data, founderId });
    return startup.toObject();
  },

  async findById(id: string) {
    return StartupModel.findById(id).lean().exec();
  },

  async search(
    filters: { industry?: string; stage?: StartupStage; textQuery?: string },
    cursor: string | undefined,
    limit: number
  ) {
    const query: Record<string, unknown> = { isPubliclyListed: true };
    if (filters.industry) query.industry = filters.industry;
    if (filters.stage) query.stage = filters.stage;
    if (filters.textQuery) query.$text = { $search: filters.textQuery };
    if (cursor) query._id = { $lt: cursor };

    return StartupModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByIds(ids: string[]) {
    return StartupModel.find({ _id: { $in: ids } }).lean().exec();
  },
};

export const dealRepository = {
  async create(investorId: string, startupId: string, notes?: string) {
    const deal = await DealModel.create({ investorId, startupId, notes: notes ?? null, stage: "interested" });
    return deal.toObject();
  },

  async findByInvestorAndStartup(investorId: string, startupId: string) {
    return DealModel.findOne({ investorId, startupId }).lean().exec();
  },

  async findById(id: string) {
    return DealModel.findById(id).lean().exec();
  },

  async updateStage(id: string, stage: DealStage, notes?: string) {
    return DealModel.findByIdAndUpdate(id, { stage, ...(notes ? { notes } : {}) }, { new: true }).lean().exec();
  },

  async findByInvestor(investorId: string, cursor: string | undefined, limit: number, stage?: string) {
    const query: Record<string, unknown> = { investorId };
    if (stage) query.stage = stage;
    if (cursor) query._id = { $lt: cursor };

    return DealModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type InvestorRepository = typeof investorRepository;
export type StartupRepository = typeof startupRepository;
export type DealRepository = typeof dealRepository;

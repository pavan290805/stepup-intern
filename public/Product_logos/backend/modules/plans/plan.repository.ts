import { PlanModel } from "@/database/models/plan.model";
import type { CreatePlanDto } from "@/modules/plans/plan.validators";
import type { PlanRole } from "@/database/models/plan.model";

export const planRepository = {
  async create(data: CreatePlanDto) {
    const plan = await PlanModel.create(data);
    return plan.toObject();
  },

  async findById(id: string) {
    return PlanModel.findById(id).lean().exec();
  },

  async findByKey(key: string) {
    return PlanModel.findOne({ key }).lean().exec();
  },

  async listActive(role?: PlanRole) {
    const query: Record<string, unknown> = { isActive: true };
    if (role) query.role = role;
    return PlanModel.find(query).sort({ role: 1, tier: 1 }).lean().exec();
  },
};

export type PlanRepository = typeof planRepository;

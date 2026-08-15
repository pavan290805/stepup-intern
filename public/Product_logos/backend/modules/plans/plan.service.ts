import { planRepository } from "@/modules/plans/plan.repository";
import { ConflictError, NotFoundError } from "@/shared/errors";
import type { CreatePlanDto, ListPlansQuery } from "@/modules/plans/plan.validators";

export const planService = {
  async list(query: ListPlansQuery) {
    return planRepository.listActive(query.role);
  },

  async getById(planId: string) {
    const plan = await planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError("Plan not found");
    }
    return plan;
  },

  async create(data: CreatePlanDto) {
    const existing = await planRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError(`A plan with key "${data.key}" already exists`);
    }
    return planRepository.create(data);
  },
};

export type PlanService = typeof planService;

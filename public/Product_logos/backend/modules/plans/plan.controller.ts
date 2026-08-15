import type { NextRequest } from "next/server";
import { planService } from "@/modules/plans/plan.service";
import { createPlanSchema, listPlansQuerySchema } from "@/modules/plans/plan.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const planController = {
  async list(request: NextRequest) {
    const parsed = listPlansQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.flatten());
    }

    const plans = await planService.list(parsed.data);
    return ApiResponse.success(plans, "Plans retrieved");
  },

  async create(request: NextRequest, context: AuthContext) {
    void context;
    const body = await parseJsonBody(request);
    const parsed = createPlanSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid plan payload", parsed.error.flatten());
    }

    const plan = await planService.create(parsed.data);
    return ApiResponse.created(plan, "Plan created");
  },
};

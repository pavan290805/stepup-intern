import type { NextRequest } from "next/server";
import { subscriptionService } from "@/modules/subscriptions/subscription.service";
import { cancelSubscriptionSchema } from "@/modules/subscriptions/subscription.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const subscriptionController = {
  async getStatus(request: NextRequest, context: AuthContext) {
    const status = await subscriptionService.getStatus(context.user.id);
    return ApiResponse.success(status, "Subscription status retrieved");
  },

  async cancel(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = cancelSubscriptionSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    const result = await subscriptionService.cancel(context.user.id, parsed.data.atPeriodEnd);
    return ApiResponse.success(result, parsed.data.atPeriodEnd ? "Subscription will cancel at period end" : "Subscription cancelled");
  },
};

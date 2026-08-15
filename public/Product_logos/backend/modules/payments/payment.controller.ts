import type { NextRequest } from "next/server";
import { paymentService } from "@/modules/payments/payment.service";
import { createCheckoutOrderSchema, paymentHistoryQuerySchema } from "@/modules/payments/payment.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const paymentController = {
  async createCheckoutOrder(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createCheckoutOrderSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    const order = await paymentService.createCheckoutOrder(context.user.id, parsed.data.planId);
    return ApiResponse.created(order, "Checkout order created");
  },

  async history(request: NextRequest, context: AuthContext) {
    const parsed = paymentHistoryQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.flatten());
    }

    const result = await paymentService.getHistory(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Payment history retrieved");
  },

  async getById(request: NextRequest, context: AuthContext) {
    const paymentId = context.params?.id;
    if (!paymentId) throw new ValidationError("Payment id is required");

    const payment = await paymentService.getById(context.user.id, paymentId);
    return ApiResponse.success(payment, "Payment retrieved");
  },

  async webhook(request: NextRequest) {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const result = await paymentService.processWebhook(rawBody, signature);
    return ApiResponse.success(result, result.processed ? "Webhook processed" : "Webhook already processed (duplicate)");
  },
};

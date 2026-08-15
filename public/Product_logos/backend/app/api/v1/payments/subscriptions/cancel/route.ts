import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.cancelSubscription(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));

/**
 * @openapi
 * /payments/subscriptions/cancel:
 *   post:
 *     operationId: paymentCancelSubscription
 *     summary: Cancel the authenticated user's subscription
 *     description: |
 *       Cancels the current subscription at the end of the current billing
 *       period. Access remains active until `currentPeriodEnd`.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Subscription cancelled (effective at period end)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Subscription'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: No active subscription to cancel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

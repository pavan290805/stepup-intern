import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.getSubscription(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler))));

/**
 * @openapi
 * /payments/subscriptions:
 *   get:
 *     operationId: paymentGetSubscription
 *     summary: Get the authenticated user's current subscription
 *     description: Returns the user's active subscription, plan details, and billing period dates.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Subscription retrieved
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
 *         description: No active subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

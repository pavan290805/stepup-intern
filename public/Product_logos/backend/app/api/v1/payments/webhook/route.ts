import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return paymentController.webhook(request);
}

export const POST = withSecurityHeaders(withErrorHandler(handler));

/**
 * @openapi
 * /payments/webhook:
 *   post:
 *     operationId: paymentWebhook
 *     summary: Razorpay payment webhook
 *     description: |
 *       Receives and validates signed webhook events from Razorpay. The
 *       `X-Razorpay-Signature` header is verified using HMAC-SHA256
 *       before any processing occurs. On `payment.captured` events, the
 *       user's subscription is activated and an invoice is generated.
 *
 *       **This endpoint must NOT require authentication.** Razorpay sends
 *       events server-to-server.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Razorpay webhook event payload
 *     parameters:
 *       - in: header
 *         name: X-Razorpay-Signature
 *         required: true
 *         schema:
 *           type: string
 *         description: HMAC-SHA256 signature from Razorpay for payload verification
 *     responses:
 *       '200':
 *         description: Webhook acknowledged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '400':
 *         description: Invalid signature or unrecognised event type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

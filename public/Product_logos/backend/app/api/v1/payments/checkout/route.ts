import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.checkout(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));

/**
 * @openapi
 * /payments/checkout:
 *   post:
 *     operationId: paymentCheckout
 *     summary: Initiate a payment checkout (Razorpay order)
 *     description: |
 *       Creates a Razorpay order for the specified plan and returns the
 *       order ID and key ID required to render the Razorpay checkout widget
 *       on the client. The actual payment is completed client-side; the
 *       webhook at `POST /payments/webhook` finalises the subscription.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CheckoutBody'
 *     responses:
 *       '200':
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         orderId:
 *                           type: string
 *                           example: order_OxAbCdEfGh
 *                         keyId:
 *                           type: string
 *                           example: rzp_live_XxYyZz
 *                         amount:
 *                           type: integer
 *                           description: Amount in paise (smallest currency unit)
 *                         currency:
 *                           type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: Plan not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

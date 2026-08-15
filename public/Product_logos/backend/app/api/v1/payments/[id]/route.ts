import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  return paymentController.getById(request, { params: context?.params });
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler as unknown as (req: NextRequest, ctx: AuthContext) => Promise<Response>))));

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     operationId: paymentGetById
 *     summary: Get a single payment record by ID
 *     description: Returns the full payment record. Users can only access their own payments.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Payment retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payment'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

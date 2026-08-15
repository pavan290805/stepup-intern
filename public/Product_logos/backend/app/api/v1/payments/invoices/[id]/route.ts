import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.getById(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler))));

/**
 * @openapi
 * /payments/invoices/{id}:
 *   get:
 *     operationId: paymentGetInvoice
 *     summary: Get a single invoice by ID
 *     description: Returns full details of a specific invoice. Users can only access their own invoices.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Invoice retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Invoice'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

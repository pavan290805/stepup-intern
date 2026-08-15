import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.downloadInvoice(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler))));

/**
 * @openapi
 * /payments/invoices/{id}/download:
 *   get:
 *     operationId: paymentDownloadInvoice
 *     summary: Download an invoice as PDF
 *     description: |
 *       Returns the invoice as a PDF file. Users can only download their
 *       own invoices. The response Content-Type is `application/pdf`.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Invoice PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

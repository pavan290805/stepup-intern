import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { paymentController } from "@/modules/payments/payment.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest) {
  await connectToDatabase();
  return paymentController.listPlans(request);
}

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return paymentController.createPlan(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
export const POST = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN], postHandler)(r, c))))
);

/**
 * @openapi
 * /payments/plans:
 *   get:
 *     operationId: paymentListPlans
 *     summary: List all active subscription plans
 *     description: |
 *       Public endpoint. Returns all active subscription plans with their
 *       pricing and feature details.
 *     tags:
 *       - Payments
 *     responses:
 *       '200':
 *         description: Plans retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Plan'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: paymentCreatePlan
 *     summary: Create a new subscription plan (admin only)
 *     description: Creates a new subscription plan. Only admins and super admins can create plans.
 *     tags:
 *       - Payments
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - currency
 *               - interval
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pro
 *               price:
 *                 type: number
 *                 example: 999
 *               currency:
 *                 type: string
 *                 example: INR
 *               interval:
 *                 type: string
 *                 enum: [monthly, yearly]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       '201':
 *         description: Plan created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Plan'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

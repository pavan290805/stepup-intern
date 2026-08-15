import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { recruiterController } from "@/modules/recruiters/recruiter.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.analytics(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/analytics:
 *   get:
 *     operationId: recruiterAnalytics
 *     summary: Get recruiter analytics and hiring funnel data
 *     description: |
 *       Returns detailed analytics for the recruiter: application funnel
 *       breakdown, conversion rates, top-performing internship listings,
 *       and time-to-hire metrics.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Analytics data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

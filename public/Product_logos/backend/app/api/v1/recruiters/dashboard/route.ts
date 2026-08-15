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
  return recruiterController.dashboard(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/dashboard:
 *   get:
 *     operationId: recruiterDashboard
 *     summary: Get recruiter dashboard summary
 *     description: |
 *       Returns aggregated dashboard data for the recruiter: active
 *       internship count, total applications, recent applicant activity,
 *       and upcoming interviews.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard data retrieved
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

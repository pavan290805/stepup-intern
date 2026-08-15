import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { applicationController } from "@/modules/applications/application.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return applicationController.listForRecruiter(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/applicants:
 *   get:
 *     operationId: recruiterListApplicants
 *     summary: List all applicants across recruiter's internships
 *     description: |
 *       Returns a cursor-paginated list of all applications received for
 *       internships owned by the authenticated recruiter. Filterable by
 *       internship ID and status.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CursorQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/StatusFilter'
 *       - name: internshipId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter applications by specific internship ID
 *     responses:
 *       '200':
 *         description: Applicants retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedResult'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

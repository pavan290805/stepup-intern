import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.dashboard(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));

/**
 * @openapi
 * /students/dashboard:
 *   get:
 *     operationId: studentDashboard
 *     summary: Get student dashboard summary
 *     description: |
 *       Returns a dashboard summary for the student including recent
 *       applications, saved internships count, profile completion, and
 *       recommended internships.
 *     tags:
 *       - Students
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

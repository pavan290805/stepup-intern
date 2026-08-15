import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { applicationController } from "@/modules/applications/application.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return applicationController.apply(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return applicationController.history(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));

/**
 * @openapi
 * /students/applications:
 *   get:
 *     operationId: studentListApplications
 *     summary: List all applications by the authenticated student
 *     description: |
 *       Returns a cursor-paginated list of all internship applications
 *       submitted by the current student.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CursorQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/StatusFilter'
 *     responses:
 *       '200':
 *         description: Applications retrieved
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
 *   post:
 *     operationId: studentApply
 *     summary: Apply to an internship
 *     description: |
 *       Submits an application for the specified internship. The student must
 *       have an active resume (or provide `resumeId` explicitly). A student
 *       cannot apply twice to the same internship.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateApplicationBody'
 *     responses:
 *       '201':
 *         description: Application submitted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Application'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '409':
 *         description: Already applied to this internship
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.deleteResume(request, context);
}

async function patchHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.setActiveResume(request, context);
}

export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], deleteHandler)(r, c)))));
export const PATCH = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], patchHandler)(r, c)))));

/**
 * @openapi
 * /students/resume/{id}:
 *   delete:
 *     operationId: studentDeleteResume
 *     summary: Delete a specific resume
 *     description: |
 *       Permanently deletes the specified resume. The student must own the
 *       resume. If it was the active resume, the active pointer is cleared.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Resume deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   patch:
 *     operationId: studentSetActiveResume
 *     summary: Set a resume as the active (default) resume
 *     description: |
 *       Marks the specified resume as the student's active resume. This is
 *       the resume pre-selected when applying to internships.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Active resume updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

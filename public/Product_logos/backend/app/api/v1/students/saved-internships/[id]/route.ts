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
  return studentController.unsaveInternship(request, context);
}

export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], deleteHandler)(r, c)))));

/**
 * @openapi
 * /students/saved-internships/{id}:
 *   delete:
 *     operationId: studentUnsaveInternship
 *     summary: Remove an internship from saved list
 *     description: Removes the specified internship from the student's saved/bookmarked list.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Internship removed from saved list
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

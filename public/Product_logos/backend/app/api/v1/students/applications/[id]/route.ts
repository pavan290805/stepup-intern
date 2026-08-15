import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { applicationController } from "@/modules/applications/application.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return applicationController.withdraw(request, context);
}

export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], deleteHandler)(r, c)))));

/**
 * @openapi
 * /students/applications/{id}:
 *   delete:
 *     operationId: studentWithdrawApplication
 *     summary: Withdraw (delete) an application
 *     description: |
 *       Withdraws the specified application. Only applications that are still
 *       in `pending` or `reviewed` status can be withdrawn. Accepted or hired
 *       applications cannot be withdrawn.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Application withdrawn
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

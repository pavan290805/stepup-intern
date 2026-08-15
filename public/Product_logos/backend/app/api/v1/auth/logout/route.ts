import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.logout(request);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(handler)));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     operationId: authLogout
 *     summary: Log out and revoke the current session
 *     description: |
 *       Revokes the current session token and clears the session cookie.
 *       Subsequent requests with the old cookie will receive `401`.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Logged out successfully
 *               data: {}
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

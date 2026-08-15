import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuthRateLimit } from "@/middlewares/rate-limit.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.resetPassword(request);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) => withAuthRateLimit(handler, "auth:reset-password")(request))
  )
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     operationId: authResetPassword
 *     summary: Reset password using a reset token
 *     description: |
 *       Validates the password-reset token (from the email link) and updates
 *       the user's password. The token is single-use and expires after a
 *       short window.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token from the email link
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Must match `password`
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '404':
 *         description: Token not found, already used, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

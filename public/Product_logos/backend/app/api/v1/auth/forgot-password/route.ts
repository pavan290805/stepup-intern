import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuthRateLimit } from "@/middlewares/rate-limit.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.forgotPassword(request);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) => withAuthRateLimit(handler, "auth:forgot-password")(request))
  )
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     operationId: authForgotPassword
 *     summary: Request a password reset token
 *     description: |
 *       Sends a password reset link to the provided email if an account
 *       exists. Always returns `200` to prevent user enumeration.
 *       Rate-limited via adaptive auth rate-limiter.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       '200':
 *         description: |
 *           Generic success (no information about whether account exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

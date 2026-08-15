import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuthRateLimit } from "@/middlewares/rate-limit.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.login(request);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) => withAuthRateLimit(handler, "auth:login")(request))
  )
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     operationId: authLogin
 *     summary: Log in with email and password
 *     description: |
 *       Authenticates a user and issues an HTTP-only session cookie.
 *       If the account has 2FA enabled, include the current TOTP code in
 *       `twoFactorCode`; omitting it returns a `403` with a `2FA_REQUIRED`
 *       code. Rate-limited via adaptive auth rate-limiter.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginBody'
 *     responses:
 *       '200':
 *         description: Logged in successfully. Session cookie is set.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only session cookie (`stepup_session`)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Logged in successfully
 *               data:
 *                 user:
 *                   _id: 6650f0a1b2c3d4e5f6a7b8c9
 *                   email: user@example.com
 *                   role: student
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         description: Account locked, banned, unverified, or 2FA code required/invalid
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

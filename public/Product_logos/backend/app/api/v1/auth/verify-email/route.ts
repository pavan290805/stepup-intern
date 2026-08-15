import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.verifyEmail(request);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(handler)));

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     operationId: authVerifyEmail
 *     summary: Verify an account's email address
 *     description: |
 *       Validates the one-time email verification token sent to the user's
 *       inbox. Marks the account as `isEmailVerified: true` on success.
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
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email verification token received by email
 *                 example: eyJhbGciOiJIUzI1NiJ9.abc123
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Email verified successfully
 *               data: {}
 *       '404':
 *         description: Token not found, already used, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

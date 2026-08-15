import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withRateLimit } from "@/middlewares/rate-limit.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.register(request);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) => withRateLimit(handler, { key: "auth:register", max: 5, windowMs: 60_000 })(request))
  )
);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     operationId: authRegister
 *     summary: Register a new user
 *     description: |
 *       Creates a new account. The `role` must be one of the self-registerable
 *       roles (`student`, `recruiter`, `investor`, `mentor`). An email
 *       verification link is sent after successful registration.
 *       Rate-limited to **5 requests per minute** per IP.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       $ref: '#/components/requestBodies/RegisterBody'
 *     responses:
 *       '201':
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Registration successful. Please verify your email.
 *               data:
 *                 userId: 6650f0a1b2c3d4e5f6a7b8c9
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

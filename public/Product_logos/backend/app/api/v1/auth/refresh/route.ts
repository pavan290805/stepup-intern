import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withRateLimit } from "@/middlewares/rate-limit.middleware";

async function handler(request: NextRequest) {
  await connectToDatabase();
  return authController.refresh(request);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) => withRateLimit(handler, { key: "auth:refresh", max: 30, windowMs: 60_000 })(request))
  )
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     operationId: authRefresh
 *     summary: Rotate the session using the refresh token cookie
 *     description: |
 *       Exchanges the current refresh token (read from the HTTP-only cookie)
 *       for a new access token + refresh token pair. The old refresh token is
 *       invalidated. Rate-limited to **30 requests per minute**.
 *     tags:
 *       - Authentication
 *     responses:
 *       '200':
 *         description: Session refreshed. New cookies are issued.
 *         headers:
 *           Set-Cookie:
 *             description: Refreshed session cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         description: Refresh token missing, invalid, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

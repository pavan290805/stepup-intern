import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { recruiterController } from "@/modules/recruiters/recruiter.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { withRateLimit } from "@/middlewares/rate-limit.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.generateJd(request, context);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request, ctx) =>
      withRateLimit(
        (r) => withAuth((rr, cc) => withRole([ROLES.RECRUITER], postHandler)(rr, cc))(r),
        { key: "ai:jd-generator", max: 10, windowMs: 60_000 }
      )(request, ctx)
    )
  )
);

/**
 * @openapi
 * /recruiters/ai/jd-generator:
 *   post:
 *     operationId: recruiterGenerateJd
 *     summary: AI-powered job description generator
 *     description: |
 *       Generates a professional, structured job description using AI
 *       based on the provided role details. Rate-limited to
 *       **10 requests per minute** per user.
 *     tags:
 *       - AI
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleTitle
 *               - location
 *             properties:
 *               roleTitle:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Software Engineering Intern
 *               companyDescription:
 *                 type: string
 *                 maxLength: 2000
 *                 example: We are a fast-growing AI startup building the future of talent management.
 *               skillsRequired:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 30
 *                 example: [React, TypeScript, Node.js]
 *               location:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *                 example: Bengaluru, India
 *               type:
 *                 type: string
 *                 enum: [internship, full-time, hybrid, remote]
 *                 default: internship
 *     responses:
 *       '200':
 *         description: Job description generated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                           description: Generated job description markdown text
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

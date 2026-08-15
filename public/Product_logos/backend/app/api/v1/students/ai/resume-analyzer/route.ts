import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { withRateLimit } from "@/middlewares/rate-limit.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.analyzeResume(request, context);
}

export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request, ctx) =>
      withRateLimit(
        (r) => withAuth((rr, cc) => withRole([ROLES.STUDENT], postHandler)(rr, cc))(r),
        { key: "ai:resume-analyzer", max: 10, windowMs: 60_000 }
      )(request, ctx)
    )
  )
);

/**
 * @openapi
 * /students/ai/resume-analyzer:
 *   post:
 *     operationId: studentAnalyzeResume
 *     summary: AI-powered resume analysis
 *     description: |
 *       Analyzes a resume against a target role using AI. Provide either a
 *       stored `resumeId` (uses the parsed text from the database) or raw
 *       `resumeText` (minimum 50 characters). Returns a structured analysis
 *       including strengths, gaps, and improvement suggestions.
 *
 *       Rate-limited to **10 requests per minute** per user.
 *     tags:
 *       - AI
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: ObjectId of an uploaded resume (uses stored parsed text)
 *               resumeText:
 *                 type: string
 *                 minLength: 50
 *                 maxLength: 20000
 *                 description: Raw resume text (alternative to resumeId)
 *               targetRole:
 *                 type: string
 *                 maxLength: 150
 *                 description: Target job/internship role for tailored analysis
 *                 example: Software Engineering Intern
 *           examples:
 *             byResumeId:
 *               summary: Analyze stored resume
 *               value:
 *                 resumeId: 6650f0a1b2c3d4e5f6a7b8c9
 *                 targetRole: Software Engineering Intern
 *             byText:
 *               summary: Analyze pasted resume text
 *               value:
 *                 resumeText: Alice Johnson | alice@example.com | github.com/alice ...
 *                 targetRole: Data Science Intern
 *     responses:
 *       '200':
 *         description: Resume analyzed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
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

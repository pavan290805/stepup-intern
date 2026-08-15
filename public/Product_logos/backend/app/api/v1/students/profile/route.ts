import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.getProfile(request, context);
}

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.upsertProfile(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));
export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], putHandler)(r, c)))));

/**
 * @openapi
 * /students/profile:
 *   get:
 *     operationId: studentGetProfile
 *     summary: Get the authenticated student's profile
 *     description: Returns the full profile of the currently authenticated student.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Student profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/StudentProfile'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     operationId: studentUpsertProfile
 *     summary: Create or update the authenticated student's profile
 *     description: |
 *       Creates or fully replaces the student profile. All top-level fields
 *       are optional except `fullName`.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertStudentProfileBody'
 *     responses:
 *       '200':
 *         description: Student profile saved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/StudentProfile'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

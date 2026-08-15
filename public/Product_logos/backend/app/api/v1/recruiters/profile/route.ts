import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { recruiterController } from "@/modules/recruiters/recruiter.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.getProfile(request, context);
}

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.upsertProfile(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));
export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], putHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/profile:
 *   get:
 *     operationId: recruiterGetProfile
 *     summary: Get the authenticated recruiter's profile
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Recruiter profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RecruiterProfile'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     operationId: recruiterUpsertProfile
 *     summary: Create or update the recruiter's profile
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertRecruiterProfileBody'
 *     responses:
 *       '200':
 *         description: Recruiter profile saved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RecruiterProfile'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

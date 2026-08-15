import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { internshipController } from "@/modules/internships/internship.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return internshipController.create(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return internshipController.listOwn(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/internships:
 *   get:
 *     operationId: recruiterListInternships
 *     summary: List all internships owned by the recruiter
 *     description: Returns all internship listings created by the authenticated recruiter, across all statuses.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CursorQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/StatusFilter'
 *     responses:
 *       '200':
 *         description: Internships retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedResult'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: recruiterCreateInternship
 *     summary: Create a new internship listing (draft)
 *     description: |
 *       Creates a new internship in `draft` status. The recruiter must have
 *       an active company profile. Use `POST /recruiters/internships/{id}/publish`
 *       to make it visible to students.
 *     tags:
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
 *               - title
 *               - description
 *               - location
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineering Intern
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *                 example: Bengaluru, India
 *               type:
 *                 type: string
 *                 enum: [remote, onsite, hybrid]
 *               stipend:
 *                 type: number
 *                 example: 15000
 *               duration:
 *                 type: string
 *                 example: 3 months
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '201':
 *         description: Internship created (draft)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Internship'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

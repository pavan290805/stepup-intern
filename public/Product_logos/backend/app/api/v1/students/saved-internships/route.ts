import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.saveInternship(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.getSavedInternships(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));

/**
 * @openapi
 * /students/saved-internships:
 *   get:
 *     operationId: studentGetSavedInternships
 *     summary: Get all saved (bookmarked) internships
 *     description: Returns the list of internships the student has saved/bookmarked.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Saved internships retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Internship'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: studentSaveInternship
 *     summary: Save (bookmark) an internship
 *     description: Adds an internship to the student's saved list.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - internshipId
 *             properties:
 *               internshipId:
 *                 type: string
 *                 description: MongoDB ObjectId of the internship to save
 *     responses:
 *       '200':
 *         description: Internship saved
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
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

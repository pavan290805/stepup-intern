import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { internshipController } from "@/modules/internships/internship.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return internshipController.update(request, context);
}

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return internshipController.delete(request, context);
}

export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], putHandler)(r, c)))));
export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], deleteHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/internships/{id}:
 *   put:
 *     operationId: recruiterUpdateInternship
 *     summary: Update an internship listing
 *     description: |
 *       Updates the internship. Only the recruiter who owns the listing can
 *       update it. Published internships can still be edited.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial update — provide only fields to change
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [remote, onsite, hybrid]
 *               stipend:
 *                 type: number
 *               duration:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '200':
 *         description: Internship updated
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
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     operationId: recruiterDeleteInternship
 *     summary: Delete an internship listing
 *     description: |
 *       Permanently deletes the internship and all associated applications.
 *       Only `draft` internships can be deleted directly; published ones must
 *       be closed first.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Internship deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

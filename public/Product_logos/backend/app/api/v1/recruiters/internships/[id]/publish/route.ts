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
  return internshipController.publish(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], postHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/internships/{id}/publish:
 *   post:
 *     operationId: recruiterPublishInternship
 *     summary: Publish a draft internship
 *     description: |
 *       Transitions the internship from `draft` → `published`, making it
 *       visible to students in the public search feed.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Internship published
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
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { applicationController } from "@/modules/applications/application.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function patchHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return applicationController.updateStatus(request, context);
}

export const PATCH = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], patchHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/applicants/{id}/status:
 *   patch:
 *     operationId: recruiterUpdateApplicantStatus
 *     summary: Update an applicant's application status
 *     description: |
 *       Moves an application through the recruiter-side pipeline:
 *       `pending` → `reviewed` → `shortlisted` → `hired` | `rejected`.
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [reviewed, shortlisted, rejected, hired]
 *               note:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Internal note visible to recruiter only
 *     responses:
 *       '200':
 *         description: Application status updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Application'
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
 */

import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { recruiterController } from "@/modules/recruiters/recruiter.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.createCompany(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.getCompany(request, context);
}

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return recruiterController.updateCompany(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], getHandler)(r, c)))));
export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER], putHandler)(r, c)))));

/**
 * @openapi
 * /recruiters/company:
 *   get:
 *     operationId: recruiterGetCompany
 *     summary: Get the recruiter's company profile
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Company profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Company'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: recruiterCreateCompany
 *     summary: Create a company profile
 *     description: Creates a company profile linked to the recruiter's account.
 *     tags:
 *       - Recruiters
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyBody'
 *     responses:
 *       '201':
 *         description: Company profile created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Company'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     operationId: recruiterUpdateCompany
 *     summary: Update the recruiter's company profile
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
 *             description: Partial update — all fields are optional
 *             properties:
 *               name:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Company profile updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Company'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

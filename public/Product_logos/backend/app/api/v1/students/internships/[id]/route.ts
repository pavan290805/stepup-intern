import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { internshipController } from "@/modules/internships/internship.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  return internshipController.getById(request, { params: context?.params });
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));

/**
 * @openapi
 * /students/internships/{id}:
 *   get:
 *     operationId: studentGetInternship
 *     summary: Get a single internship by ID
 *     description: |
 *       Returns the full details of a single published internship. Public
 *       endpoint — no authentication required.
 *     tags:
 *       - Students
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Internship retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Internship'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

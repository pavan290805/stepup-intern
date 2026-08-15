import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { internshipController } from "@/modules/internships/internship.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";

async function getHandler(request: NextRequest) {
  await connectToDatabase();
  return internshipController.search(request);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));

/**
 * @openapi
 * /students/internships:
 *   get:
 *     operationId: studentSearchInternships
 *     summary: Search and discover published internships
 *     description: |
 *       Public endpoint — no authentication required. Returns a
 *       cursor-paginated list of internships matching the given filters.
 *       Only `published` internships are visible.
 *     tags:
 *       - Students
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/CursorQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - name: location
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by location (city/country)
 *       - name: type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [remote, onsite, hybrid]
 *         description: Filter by work arrangement
 *       - name: skill
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by required skill
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
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

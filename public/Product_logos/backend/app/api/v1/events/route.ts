import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { eventController } from "@/modules/events/event.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest) {
  await connectToDatabase();
  return eventController.search(request);
}

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return eventController.create(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
export const POST = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.RECRUITER], postHandler)(r, c))))
);

/**
 * @openapi
 * /events:
 *   get:
 *     operationId: eventSearch
 *     summary: Search and discover published events
 *     description: |
 *       Public endpoint — no authentication required. Returns a
 *       cursor-paginated list of published events matching the filters.
 *     tags:
 *       - Events
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/CursorQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - name: tag
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by event tag
 *       - name: isVirtual
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by virtual vs. in-person
 *     responses:
 *       '200':
 *         description: Events retrieved
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
 *   post:
 *     operationId: eventCreate
 *     summary: Create a new event (draft)
 *     description: |
 *       Creates a new event in `draft` status. Accessible to recruiters,
 *       admins, and super admins. Use `POST /events/{id}/publish` to make it
 *       visible to attendees.
 *     tags:
 *       - Events
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
 *               - startAt
 *               - endAt
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 10000
 *               startAt:
 *                 type: string
 *                 format: date-time
 *               endAt:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               isVirtual:
 *                 type: boolean
 *                 default: false
 *               meetingLink:
 *                 type: string
 *                 format: uri
 *               maxAttendees:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

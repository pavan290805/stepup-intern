import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { eventController } from "@/modules/events/event.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  return eventController.getById(request, { params: context?.params });
}

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return eventController.update(request, context);
}

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return eventController.delete(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
export const PUT = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.RECRUITER], putHandler)(r, c))))
);
export const DELETE = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.RECRUITER], deleteHandler)(r, c))))
);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     operationId: eventGetById
 *     summary: Get a single event by ID
 *     description: Returns full details of a specific event. Public endpoint.
 *     tags:
 *       - Events
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Event retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Event'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     operationId: eventUpdate
 *     summary: Update an event
 *     description: Updates an event. Only the organizer, admins, or super admins can update.
 *     tags:
 *       - Events
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
 *               meetingLink:
 *                 type: string
 *               maxAttendees:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Event updated
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
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     operationId: eventDelete
 *     summary: Delete an event
 *     description: Permanently deletes an event. Only organizer, admins, or super admins can delete.
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Event deleted
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

import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { registrationController } from "@/modules/event-registrations/registration.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return registrationController.register(request, context);
}

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return registrationController.cancelRegistration(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));
export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(deleteHandler))));

/**
 * @openapi
 * /events/{id}/register:
 *   post:
 *     operationId: eventRegister
 *     summary: Register for an event
 *     description: Registers the authenticated user for the specified event.
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '201':
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Registration'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '409':
 *         description: Already registered for this event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     operationId: eventUnregister
 *     summary: Cancel registration for an event
 *     description: Removes the authenticated user's registration from the specified event.
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Registration cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: Registration not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

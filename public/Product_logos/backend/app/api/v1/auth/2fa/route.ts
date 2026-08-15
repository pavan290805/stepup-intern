import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return authController.initiateTwoFactor(context.user.id);
}

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return authController.confirmTwoFactor(request, context.user.id);
}

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return authController.disableTwoFactor(context.user.id, context.user.role);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler))));
export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));
export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(deleteHandler))));

/**
 * @openapi
 * /auth/2fa:
 *   get:
 *     operationId: auth2faInitiate
 *     summary: Begin 2FA enrollment (returns TOTP secret and otpauth URL)
 *     description: |
 *       Returns a new TOTP secret and an `otpauth://` URL that can be
 *       rendered as a QR code. The user scans the QR code with their
 *       authenticator app, then calls `POST /auth/2fa` to confirm enrollment.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: TOTP enrollment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               data:
 *                 secret: BASE32SECRET
 *                 otpauthUrl: otpauth://totp/StepUp:user@example.com?secret=BASE32SECRET&issuer=StepUp
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: auth2faConfirm
 *     summary: Confirm 2FA enrollment with a valid TOTP code
 *     description: |
 *       Completes 2FA enrollment by verifying that the user's authenticator
 *       app is producing valid codes for the issued secret. On success,
 *       2FA is enabled and a one-time set of backup codes is returned.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmTwoFactorBody'
 *     responses:
 *       '200':
 *         description: 2FA enabled. Backup codes are returned once.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Two-factor authentication enabled
 *               data:
 *                 backupCodes:
 *                   - a1b2c3d4e5
 *                   - f6g7h8i9j0
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     operationId: auth2faDisable
 *     summary: Disable 2FA
 *     description: |
 *       Disables two-factor authentication for the authenticated user.
 *       Not permitted for `admin` or `super_admin` roles (2FA is mandatory
 *       for those roles).
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: 2FA disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         description: 2FA is mandatory for this role and cannot be disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

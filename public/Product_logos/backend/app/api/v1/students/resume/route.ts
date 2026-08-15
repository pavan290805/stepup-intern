import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { studentController } from "@/modules/students/student.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.uploadResume(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return studentController.listResumes(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));

/**
 * @openapi
 * /students/resume:
 *   get:
 *     operationId: studentListResumes
 *     summary: List all uploaded resumes for the authenticated student
 *     description: Returns all resumes uploaded by the current student, including which one is currently active.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Resumes retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Resume'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     operationId: studentUploadResume
 *     summary: Upload a new resume (PDF or DOCX)
 *     description: |
 *       Accepts a `multipart/form-data` upload containing the resume file
 *       under the key `file`. The file is stored in Cloudinary.
 *       Maximum file size and accepted MIME types are enforced server-side.
 *     tags:
 *       - Students
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/ResumeUpload'
 *     responses:
 *       '201':
 *         description: Resume uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Resume'
 *       '400':
 *         description: File not provided or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */

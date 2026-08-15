import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { mentorController } from "@/modules/mentors/mentor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return mentorController.requestSession(request, context);
}

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return mentorController.sessionsForMentor(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], postHandler)(r, c)))));
export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.MENTOR], getHandler)(r, c)))));

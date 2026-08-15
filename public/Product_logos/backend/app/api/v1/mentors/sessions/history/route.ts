import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { mentorController } from "@/modules/mentors/mentor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return mentorController.sessionsForStudent(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.STUDENT], getHandler)(r, c)))));

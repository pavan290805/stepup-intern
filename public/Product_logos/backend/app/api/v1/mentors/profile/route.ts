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
  return mentorController.getProfile(request, context);
}

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return mentorController.upsertProfile(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.MENTOR], getHandler)(r, c)))));
export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.MENTOR], putHandler)(r, c)))));

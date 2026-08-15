import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { investorController } from "@/modules/investors/investor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest) {
  await connectToDatabase();
  return investorController.searchStartups(request);
}

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return investorController.createStartup(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.RECRUITER, ROLES.ADMIN, ROLES.SUPER_ADMIN], postHandler)(r, c)))));

import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { investorController } from "@/modules/investors/investor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return investorController.unsaveStartup(request, context);
}

export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.INVESTOR], deleteHandler)(r, c)))));

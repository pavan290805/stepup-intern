import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { investorController } from "@/modules/investors/investor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function putHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return investorController.updateDealStage(request, context);
}

export const PUT = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.INVESTOR], putHandler)(r, c)))));

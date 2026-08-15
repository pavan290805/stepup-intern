import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { adminController } from "@/modules/admin/admin.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  return adminController.getUser(request, { params: context?.params });
}

export const GET = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN], getHandler)(r, c))))
);

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { adminController } from "@/modules/admin/admin.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { ROLES } from "@/shared/constants/roles";

async function getHandler(request: NextRequest, context: AuthContext) {
  void context;
  await connectToDatabase();
  const csv = await adminController.exportUsers(request);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"users-export.csv\"",
    },
  });
}

export const GET = withSecurityHeaders(
  withRequestLogger(withErrorHandler(withAuth((r, c) => withRole([ROLES.ADMIN, ROLES.SUPER_ADMIN], getHandler)(r, c))))
);

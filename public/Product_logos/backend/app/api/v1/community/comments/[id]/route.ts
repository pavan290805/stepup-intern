import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { communityController } from "@/modules/community/community.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function deleteHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return communityController.deleteComment(request, context);
}

export const DELETE = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(deleteHandler))));

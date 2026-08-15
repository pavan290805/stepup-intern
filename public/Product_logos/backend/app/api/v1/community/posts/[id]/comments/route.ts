import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { communityController } from "@/modules/community/community.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  return communityController.getComments(request, { params: context?.params });
}

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return communityController.addComment(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));

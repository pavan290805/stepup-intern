import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { messageController } from "@/modules/messaging/message.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function getHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return messageController.getThread(request, context);
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(getHandler))));

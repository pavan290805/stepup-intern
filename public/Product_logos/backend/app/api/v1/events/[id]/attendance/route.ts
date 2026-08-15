import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { registrationController } from "@/modules/event-registrations/registration.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";

async function postHandler(request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  return registrationController.markAttendance(request, context);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(withAuth(postHandler))));

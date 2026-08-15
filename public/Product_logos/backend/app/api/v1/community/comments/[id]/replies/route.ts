import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { communityService } from "@/modules/community/community.service";
import { commentListQuerySchema } from "@/modules/community/community.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import type { RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  const commentId = context?.params?.id;
  if (!commentId) throw new ValidationError("Comment id is required");

  const parsed = commentListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

  const result = await communityService.getReplies(commentId, parsed.data.cursor, parsed.data.limit);
  return ApiResponse.success(result, "Replies retrieved");
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));

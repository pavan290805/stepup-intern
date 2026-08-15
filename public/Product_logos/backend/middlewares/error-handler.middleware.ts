import type { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors";
import { ApiResponse, type ApiErrorBody, type ApiSuccessBody } from "@/shared/response/api-response";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("error-handler");

export type RouteContext = { params?: Record<string, string> };

export type RouteHandler = (request: NextRequest, context?: RouteContext) => Promise<NextResponse>;

/**
 * Wraps every route handler so a thrown error anywhere in the
 * controller -> service -> repository chain is funneled through one place
 * and normalized into the standard `{ success: false, error }` envelope.
 * This is the single source of truth for "what does an error response look
 * like" across all ~80 endpoints in the platform.
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, requestId, request);
    }
  };
}

function handleError(
  error: unknown,
  requestId: string,
  request: NextRequest
): NextResponse<ApiErrorBody> | NextResponse<ApiSuccessBody<never>> {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error, requestId, path: request.nextUrl.pathname }, error.message);
    } else {
      logger.warn(
        { code: error.code, requestId, path: request.nextUrl.pathname },
        error.message
      );
    }

    return ApiResponse.error(error.code, error.message, error.statusCode, error.details, { requestId });
  }

  if (error instanceof ZodError) {
    logger.warn({ requestId, path: request.nextUrl.pathname }, "Unhandled Zod validation error");
    return ApiResponse.error(
      "VALIDATION_ERROR",
      "Validation failed",
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      error.flatten(),
      { requestId }
    );
  }

  // Unexpected/programming error: never leak internals to the client.
  logger.error({ err: error, requestId, path: request.nextUrl.pathname }, "Unhandled error");
  return ApiResponse.error(
    "INTERNAL_ERROR",
    "An unexpected error occurred. Please try again later.",
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    undefined,
    { requestId }
  );
}

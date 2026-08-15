import type { NextRequest, NextResponse } from "next/server";
import { createModuleLogger } from "@/config/logger.config";
import type { RouteHandler, RouteContext } from "@/middlewares/error-handler.middleware";

const logger = createModuleLogger("http");

export function withRequestLogger(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: RouteContext) => {
    const start = Date.now();
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

    const response = (await handler(request, context)) as NextResponse;
    response.headers.set("x-request-id", requestId);

    const durationMs = Date.now() - start;
    logger.info(
      {
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        status: response.status,
        durationMs,
      },
      "request completed"
    );

    return response;
  };
}

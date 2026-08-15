import type { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import type { RouteHandler, RouteContext } from "@/middlewares/error-handler.middleware";

/**
 * Helmet-equivalent security headers. Next.js has no built-in Helmet, so
 * these are applied by hand to every API response.
 */
export function withSecurityHeaders(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: RouteContext) => {
    const response = (await handler(request, context)) as NextResponse;

    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'none'; frame-ancestors 'none'"
    );

    if (env.NODE_ENV === "production") {
      response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    }

    return response;
  };
}

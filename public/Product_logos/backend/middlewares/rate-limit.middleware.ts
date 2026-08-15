import type { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { TooManyRequestsError } from "@/shared/errors";
import type { RouteHandler, RouteContext } from "@/middlewares/error-handler.middleware";

interface RateLimitBucket {
  count: number;
  windowStartedAt: number;
}

/**
 * Phase 1 implements rate limiting as an in-process sliding window keyed by
 * IP + route, which is sufficient for a single-instance deployment and for
 * making the module fully testable without provisioning Redis yet.
 *
 * This is intentionally the *only* place that knows the storage is
 * in-memory: the exported `withRateLimit` signature is identical to what a
 * Redis-backed version (`config/redis.config.ts`, introduced alongside the
 * Payments/Events phases) would expose, so upgrading later is a swap of the
 * `buckets` implementation, not a rewrite of every route that uses it.
 */
const buckets = new Map<string, RateLimitBucket>();

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() : request.headers.get("x-real-ip");
  return ip ?? "unknown";
}

export interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  /** Distinguishes rate-limit buckets per logical route (e.g. "auth:login"). */
  key: string;
}

export function withRateLimit(handler: RouteHandler, options: RateLimitOptions): RouteHandler {
  const windowMs = options.windowMs ?? env.RATE_LIMIT_WINDOW_MS;
  const max = options.max ?? env.RATE_LIMIT_MAX;

  return async (request: NextRequest, context?: RouteContext) => {
    const identifier = `${options.key}:${getClientIdentifier(request)}`;
    const now = Date.now();
    const bucket = buckets.get(identifier);

    if (!bucket || now - bucket.windowStartedAt >= windowMs) {
      buckets.set(identifier, { count: 1, windowStartedAt: now });
    } else {
      bucket.count += 1;
      if (bucket.count > max) {
        throw new TooManyRequestsError(
          `Too many requests to ${options.key}. Please wait before trying again.`
        );
      }
    }

    return (await handler(request, context)) as NextResponse;
  };
}

/** Stricter preset for auth-sensitive endpoints (login, forgot-password, etc.). */
export function withAuthRateLimit(handler: RouteHandler, key: string): RouteHandler {
  return withRateLimit(handler, { key, windowMs: 15 * 60_000, max: 10 });
}

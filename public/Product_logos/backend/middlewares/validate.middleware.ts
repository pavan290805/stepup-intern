import type { NextRequest, NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";

/**
 * Generic request-body validator, reusable by any module's route handler.
 * The Auth module's controller currently parses+validates inline (see
 * modules/auth/auth.controller.ts) since each endpoint needs fine-grained
 * control over its error messages; later modules (Students, Recruiters)
 * that don't need that granularity can wrap their handler with this instead
 * to avoid repeating the parse/validate boilerplate.
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, body: T, context?: unknown) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: unknown) => {
    const body = await parseJsonBody(request);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError("Request validation failed", parsed.error.flatten());
    }

    return handler(request, parsed.data, context);
  };
}

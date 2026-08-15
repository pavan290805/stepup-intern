import type { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "@/modules/subscriptions/subscription.service";
import { ForbiddenError } from "@/shared/errors";
import { ROLES } from "@/shared/constants/roles";
import type { AuthContext, AuthenticatedRouteHandler } from "@/middlewares/auth.middleware";

/**
 * Verifies an active, non-expired, correctly-tiered premium subscription
 * before allowing access. Composes after `withAuth`/`withRole`, mirroring
 * `rbac.middleware.ts`'s style: `withAuth((r, c) => requirePremium(handler)(r, c))`.
 */
export function requirePremium(handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    const isPremium = await subscriptionService.isPremiumActive(context.user.id, context.user.role);
    if (!isPremium) {
      throw new ForbiddenError("This feature requires an active Premium subscription");
    }
    return handler(request, context);
  };
}

export function requireStudentPremium(handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    if (context.user.role !== ROLES.STUDENT) {
      throw new ForbiddenError("This feature is only available to students");
    }
    return requirePremium(handler)(request, context) as Promise<NextResponse>;
  };
}

export function requireRecruiterPremium(handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    if (context.user.role !== ROLES.RECRUITER) {
      throw new ForbiddenError("This feature is only available to recruiters");
    }
    return requirePremium(handler)(request, context) as Promise<NextResponse>;
  };
}

import type { NextRequest, NextResponse } from "next/server";
import { ForbiddenError } from "@/shared/errors";
import { ROLE_PERMISSIONS, type Permission } from "@/shared/constants/permissions";
import type { Role } from "@/shared/constants/roles";
import type { AuthContext, AuthenticatedRouteHandler } from "@/middlewares/auth.middleware";

/** Restricts a route (already wrapped in `withAuth`) to a specific set of roles. */
export function withRole(allowedRoles: Role[], handler: AuthenticatedRouteHandler): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    if (!allowedRoles.includes(context.user.role)) {
      throw new ForbiddenError(`This action requires one of the following roles: ${allowedRoles.join(", ")}`);
    }
    return handler(request, context);
  };
}

/** Restricts a route to callers whose role grants the given permission. */
export function withPermission(
  permission: Permission,
  handler: AuthenticatedRouteHandler
): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    const permissions = ROLE_PERMISSIONS[context.user.role] ?? [];
    if (!permissions.includes(permission)) {
      throw new ForbiddenError(`Missing required permission: ${permission}`);
    }
    return handler(request, context);
  };
}

/**
 * Ownership guard for resources scoped to the requesting user (e.g. a
 * recruiter editing only their own internship). `resolveOwnerId` is async
 * because it typically needs a repository lookup of the target resource.
 */
export function withOwnership(
  resolveOwnerId: (request: NextRequest, context: AuthContext) => Promise<string | null>,
  handler: AuthenticatedRouteHandler
): AuthenticatedRouteHandler {
  return async (request: NextRequest, context: AuthContext) => {
    const ownerId = await resolveOwnerId(request, context);
    if (!ownerId || ownerId !== context.user.id) {
      throw new ForbiddenError("You do not have access to this resource");
    }
    return handler(request, context);
  };
}

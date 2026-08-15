import type { NextRequest } from "next/server";
import { adminService } from "@/modules/admin/admin.service";
import {
  auditLogQuerySchema,
  bulkUserActionSchema,
  exportUsersQuerySchema,
  listUsersQuerySchema,
  moderateContentSchema,
  reportsQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "@/modules/admin/admin.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";
import type { EventStatus } from "@/database/models/event.model";
import type { InternshipStatus } from "@/database/models/internship.model";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const adminController = {
  async dashboard(request: NextRequest) {
    const result = await adminService.getDashboard();
    return ApiResponse.success(result, "Admin dashboard retrieved");
  },

  async listUsers(request: NextRequest) {
    const parsed = listUsersQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await adminService.listUsers(parsed.data);
    return ApiResponse.success(result, "Users retrieved");
  },

  async getUser(request: NextRequest, context: { params?: Record<string, string> }) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("User id is required");

    const user = await adminService.getUser(id);
    return ApiResponse.success(user, "User retrieved");
  },

  async approveUser(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("User id is required");

    const user = await adminService.approveUser(context.user.id, id);
    return ApiResponse.success(user, "User approved");
  },

  async setUserStatus(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("User id is required");

    const body = await parseJsonBody(request);
    const parsed = updateUserStatusSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const user = await adminService.setUserStatus(context.user.id, id, parsed.data);
    return ApiResponse.success(user, "User status updated");
  },

  async updateUserRole(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("User id is required");

    const body = await parseJsonBody(request);
    const parsed = updateUserRoleSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const user = await adminService.updateUserRole(context.user.id, id, parsed.data);
    return ApiResponse.success(user, "User role updated");
  },

  async bulkUserAction(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = bulkUserActionSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await adminService.bulkUserAction(context.user.id, parsed.data);
    return ApiResponse.success(result, "Bulk action completed");
  },

  async userStats(request: NextRequest) {
    const result = await adminService.getUserStats();
    return ApiResponse.success(result, "User statistics retrieved");
  },

  async moderateInternship(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    const body = await parseJsonBody(request);
    const parsed = moderateContentSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await adminService.moderateInternship(context.user.id, id, parsed.data.status as InternshipStatus);
    return ApiResponse.success(result, "Internship moderated");
  },

  async moderateEvent(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const body = await parseJsonBody(request);
    const parsed = moderateContentSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await adminService.moderateEvent(context.user.id, id, parsed.data.status as EventStatus);
    return ApiResponse.success(result, "Event moderated");
  },

  async moderateCommunityPost(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Post id is required");

    const body = await parseJsonBody(request);
    const parsed = moderateContentSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await adminService.moderateCommunityPost(context.user.id, id, parsed.data);
    return ApiResponse.success(result, "Post moderated");
  },

  async paymentDashboard(request: NextRequest) {
    const parsed = reportsQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await adminService.getPaymentDashboard(parsed.data.sinceDays);
    return ApiResponse.success(result, "Payment dashboard retrieved");
  },

  async subscriptionDashboard(request: NextRequest) {
    const result = await adminService.getSubscriptionDashboard();
    return ApiResponse.success(result, "Subscription dashboard retrieved");
  },

  async reports(request: NextRequest) {
    const parsed = reportsQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await adminService.getReports(parsed.data.sinceDays);
    return ApiResponse.success(result, "Reports retrieved");
  },

  async auditLogs(request: NextRequest) {
    const parsed = auditLogQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await adminService.getAuditLogs(parsed.data.cursor, parsed.data.limit, {
      actorId: parsed.data.actorId,
      targetType: parsed.data.targetType,
    });
    return ApiResponse.success(result, "Audit logs retrieved");
  },

  async exportUsers(request: NextRequest) {
    const parsed = exportUsersQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const csv = await adminService.exportUsersCsv(parsed.data.role);
    return csv;
  },
};

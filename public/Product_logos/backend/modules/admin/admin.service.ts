import { authService } from "@/modules/auth/auth.service";
import { internshipRepository } from "@/modules/internships/internship.repository";
import { eventRepository } from "@/modules/events/event.repository";
import { communityService } from "@/modules/community/community.service";
import { paymentRepository } from "@/modules/payments/payment.repository";
import { subscriptionRepository } from "@/modules/subscriptions/subscription.repository";
import { auditLogRepository, platformStatsRepository } from "@/modules/admin/admin.repository";
import { minutesFromNow } from "@/shared/utils/date";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type {
  BulkUserActionDto,
  ListUsersQuery,
  ModerateContentDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from "@/modules/admin/admin.validators";
import type { Role } from "@/shared/constants/roles";
import type { EventStatus } from "@/database/models/event.model";
import type { InternshipStatus } from "@/database/models/internship.model";

async function logAction(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string | null,
  metadata: Record<string, unknown> = {},
  ipAddress: string | null = null
) {
  await auditLogRepository.record(actorId, action, targetType, targetId, metadata, ipAddress);
}

export const adminService = {
  // ---- User Management ----
  async listUsers(query: ListUsersQuery) {
    const results = await authService.adminListUsers(
      { role: query.role, status: query.status, q: query.q },
      query.cursor,
      query.limit
    );
    return buildPaginatedResult(results, query.limit);
  },

  async getUser(userId: string) {
    return authService.adminGetUserById(userId);
  },

  async approveUser(adminId: string, userId: string) {
    const user = await authService.adminApproveUser(userId);
    await logAction(adminId, "user.approved", "User", userId, {});
    return user;
  },

  async setUserStatus(adminId: string, userId: string, data: UpdateUserStatusDto) {
    const user = await authService.adminSetUserStatus(userId, data.status);
    await logAction(adminId, `user.status_changed.${data.status}`, "User", userId, { reason: data.reason });
    return user;
  },

  async updateUserRole(adminId: string, userId: string, data: UpdateUserRoleDto) {
    const user = await authService.adminUpdateUserRole(userId, data.role as Role);
    await logAction(adminId, "user.role_changed", "User", userId, { newRole: data.role });
    return user;
  },

  async bulkUserAction(adminId: string, data: BulkUserActionDto) {
    const statusMap: Record<BulkUserActionDto["action"], "pending" | "active" | "suspended" | "banned"> = {
      approve: "active",
      activate: "active",
      suspend: "suspended",
      ban: "banned",
    };

    const results = await Promise.allSettled(
      data.userIds.map((userId) => authService.adminSetUserStatus(userId, statusMap[data.action]))
    );

    await logAction(adminId, `user.bulk_${data.action}`, "User", null, { userIds: data.userIds });

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - succeeded;
    return { succeeded, failed, total: results.length };
  },

  async getUserStats() {
    return authService.adminGetUserStats();
  },

  // ---- Internship Moderation ----
  async moderateInternship(adminId: string, internshipId: string, status: InternshipStatus) {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw new NotFoundError("Internship not found");
    }
    const updated = await internshipRepository.updateStatus(internshipId, status);
    await logAction(adminId, `internship.moderated.${status}`, "Internship", internshipId, {});
    return updated;
  },

  // ---- Event Moderation ----
  async moderateEvent(adminId: string, eventId: string, status: EventStatus) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    const updated = await eventRepository.updateStatus(eventId, status);
    await logAction(adminId, `event.moderated.${status}`, "Event", eventId, {});
    return updated;
  },

  // ---- Community Moderation ----
  async moderateCommunityPost(adminId: string, postId: string, data: ModeratePostAdminDto) {
    const result = await communityService.moderatePost(postId, adminId, {
      status: data.status as "published" | "hidden" | "removed",
      reason: data.reason,
    });
    await logAction(adminId, `community.moderated.${data.status}`, "CommunityPost", postId, { reason: data.reason });
    return result;
  },

  // ---- Dashboards ----
  async getDashboard() {
    const [userCounts, internshipCounts, eventCounts, postCounts] = await Promise.all([
      platformStatsRepository.getUserCounts(),
      platformStatsRepository.getInternshipCounts(),
      platformStatsRepository.getEventCounts(),
      platformStatsRepository.getCommunityPostCounts(),
    ]);

    return {
      usersByRole: userCounts,
      internshipsByStatus: internshipCounts,
      eventsByStatus: eventCounts,
      communityPostsByStatus: postCounts,
    };
  },

  async getPaymentDashboard(sinceDays: number) {
    const sinceDate = minutesFromNow(-1 * sinceDays * 24 * 60);
    const totals = await platformStatsRepository.getPaymentTotals(sinceDate);
    const recentPayments = await paymentRepository.findRecent(20);

    return { totals, sinceDays, recentPaymentsSample: recentPayments };
  },

  async getSubscriptionDashboard() {
    const statusCounts = await platformStatsRepository.getActiveSubscriptionCounts();
    return { subscriptionsByStatus: statusCounts };
  },

  async getReports(sinceDays: number) {
    const sinceDate = minutesFromNow(-1 * sinceDays * 24 * 60);
    const paymentTotals = await platformStatsRepository.getPaymentTotals(sinceDate);
    const userCounts = await platformStatsRepository.getUserCounts();

    return {
      period: { sinceDays, sinceDate },
      revenue: paymentTotals,
      userGrowthByRole: userCounts,
    };
  },

  async expireOverdueSubscriptions() {
    const overdue = await subscriptionRepository.findExpiredActive(new Date());
    return { overdueCount: overdue.length };
  },

  // ---- Audit Logs ----
  async getAuditLogs(cursor: string | undefined, limit: number, filters: { actorId?: string; targetType?: string }) {
    const results = await auditLogRepository.findAll(cursor, limit, filters);
    return buildPaginatedResult(results, limit);
  },

  // ---- Export ----
  async exportUsersCsv(role?: string): Promise<string> {
    const users = await authService.adminListUsers({ role }, undefined, 10_000);
    const header = "id,email,role,status,emailVerified,createdAt";
    const rows = users.map((u) =>
      [String(u._id), u.email, u.role, u.status, String(u.emailVerified), u.createdAt.toISOString()].join(",")
    );
    return [header, ...rows].join("\n");
  },
};

interface ModeratePostAdminDto {
  status: string;
  reason?: string;
}

export type AdminService = typeof adminService;

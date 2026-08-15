import { AuditLogModel } from "@/database/models/audit-log.model";
import { UserModel } from "@/database/models/user.model";
import { InternshipModel } from "@/database/models/internship.model";
import { EventModel } from "@/database/models/event.model";
import { CommunityPostModel } from "@/database/models/community-post.model";
import { PaymentModel } from "@/database/models/payment.model";
import { SubscriptionModel } from "@/database/models/subscription.model";

export const auditLogRepository = {
  async record(actorId: string, action: string, targetType: string, targetId: string | null, metadata: Record<string, unknown>, ipAddress: string | null) {
    const entry = await AuditLogModel.create({ actorId, action, targetType, targetId, metadata, ipAddress });
    return entry.toObject();
  },

  async findAll(cursor: string | undefined, limit: number, filters: { actorId?: string; targetType?: string }) {
    const query: Record<string, unknown> = {};
    if (filters.actorId) query.actorId = filters.actorId;
    if (filters.targetType) query.targetType = filters.targetType;
    if (cursor) query._id = { $lt: cursor };

    return AuditLogModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

/**
 * Read-only cross-domain aggregation for the Admin dashboard and platform
 * statistics. This is the one legitimate place that queries multiple
 * domains' models directly (never mutates them) — Admin's whole purpose is
 * cross-cutting visibility that no single domain module should own.
 */
export const platformStatsRepository = {
  async getUserCounts() {
    return UserModel.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]).exec();
  },

  async getPendingApprovalCount(role: string): Promise<number> {
    return UserModel.countDocuments({ role, status: "pending" }).exec();
  },

  async getInternshipCounts() {
    return InternshipModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).exec();
  },

  async getEventCounts() {
    return EventModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).exec();
  },

  async getCommunityPostCounts() {
    return CommunityPostModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).exec();
  },

  async getPaymentTotals(sinceDate: Date) {
    const results = await PaymentModel.aggregate([
      { $match: { status: "captured", createdAt: { $gte: sinceDate } } },
      { $group: { _id: null, totalAmountInPaise: { $sum: "$amountInPaise" }, count: { $sum: 1 } } },
    ]).exec();

    return results[0] ?? { totalAmountInPaise: 0, count: 0 };
  },

  async getActiveSubscriptionCounts() {
    return SubscriptionModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).exec();
  },
};

export type AuditLogRepository = typeof auditLogRepository;
export type PlatformStatsRepository = typeof platformStatsRepository;

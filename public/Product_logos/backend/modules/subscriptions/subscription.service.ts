import { subscriptionRepository } from "@/modules/subscriptions/subscription.repository";
import { planRepository } from "@/modules/plans/plan.repository";
import { razorpayClient } from "@/payments/razorpay.client";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { createModuleLogger } from "@/config/logger.config";
import { isPast } from "@/shared/utils/date";
import type { SubscriptionStatus } from "@/database/models/subscription.model";
import type { Role } from "@/shared/constants/roles";

const logger = createModuleLogger("subscription.service");

export const subscriptionService = {
  async getStatus(userId: string) {
    const subscription = await subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      return { subscription: null, plan: null, isPremiumActive: false };
    }

    const plan = await planRepository.findById(String(subscription.planId));
    const isPremiumActive =
      plan?.tier === "premium" &&
      subscription.status === "active" &&
      (!subscription.currentPeriodEnd || !isPast(subscription.currentPeriodEnd));

    return { subscription, plan, isPremiumActive };
  },

  async isPremiumActive(userId: string, role: Role): Promise<boolean> {
    const { subscription, plan, isPremiumActive } = await this.getStatus(userId);
    if (!subscription || !plan) return false;
    if (plan.role !== role) return false;
    return isPremiumActive;
  },

  /** Ensures every user has a baseline free-tier subscription record, e.g. right after role-specific profile creation. */
  async ensureFreeSubscription(userId: string, role: Role) {
    const existing = await subscriptionRepository.findByUserId(userId);
    if (existing) return existing;

    const freePlan = await planRepository.findByKey(role === "student" ? "student-free" : "recruiter-free");
    if (!freePlan) {
      throw new NotFoundError(`No free plan seeded for role "${role}"`);
    }

    return subscriptionRepository.upsertForUser(userId, {
      userId,
      planId: String(freePlan._id),
      status: "active",
    });
  },

  /**
   * Activates a subscription after a webhook has verified payment. Never
   * called from a frontend-triggered code path — only from
   * `modules/payments/payment.service.ts` webhook processing.
   */
  async activate(
    userId: string,
    planId: string,
    periodStart: Date,
    periodEnd: Date,
    razorpaySubscriptionId?: string | null
  ) {
    const updated = await subscriptionRepository.upsertForUser(userId, {
      userId,
      planId,
      status: "active",
      razorpaySubscriptionId: razorpaySubscriptionId ?? null,
    });

    const withPeriod = await subscriptionRepository.updateBillingPeriod(userId, periodStart, periodEnd, "active");
    logger.info({ userId, planId }, "Subscription activated");
    return withPeriod ?? updated;
  },

  async renew(userId: string, periodStart: Date, periodEnd: Date) {
    const subscription = await subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundError("No subscription found to renew");
    }

    const renewed = await subscriptionRepository.updateBillingPeriod(userId, periodStart, periodEnd, "active");
    logger.info({ userId }, "Subscription renewed");
    return renewed;
  },

  async cancel(userId: string, atPeriodEnd: boolean) {
    const subscription = await subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundError("No subscription found to cancel");
    }

    if (subscription.razorpaySubscriptionId) {
      await razorpayClient.cancelSubscription(subscription.razorpaySubscriptionId, atPeriodEnd);
    }

    if (atPeriodEnd) {
      const updated = await subscriptionRepository.setCancelAtPeriodEnd(userId, true);
      logger.info({ userId }, "Subscription set to cancel at period end");
      return updated;
    }

    const cancelled = await subscriptionRepository.markCancelled(userId);
    logger.info({ userId }, "Subscription cancelled immediately");
    return cancelled;
  },

  async expireOverdueSubscriptions(): Promise<number> {
    const overdue = await subscriptionRepository.findExpiredActive(new Date());
    for (const subscription of overdue) {
      await subscriptionRepository.markExpired(String(subscription.userId));
    }
    logger.info({ count: overdue.length }, "Expired overdue subscriptions");
    return overdue.length;
  },

  async updateStatusByRazorpaySubscriptionId(
    razorpaySubscriptionId: string,
    status: SubscriptionStatus,
    periodStart?: Date,
    periodEnd?: Date
  ) {
    return subscriptionRepository.updateByRazorpaySubscriptionId(razorpaySubscriptionId, {
      status,
      ...(periodStart ? { currentPeriodStart: periodStart } : {}),
      ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
    });
  },

  async changePlanValidated(userId: string, planId: string, expectedRole: Role) {
    const plan = await planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError("Plan not found");
    }
    if (plan.role !== expectedRole) {
      throw new ValidationError(`This plan is not available for role "${expectedRole}"`);
    }
    return plan;
  },
};

export type SubscriptionService = typeof subscriptionService;

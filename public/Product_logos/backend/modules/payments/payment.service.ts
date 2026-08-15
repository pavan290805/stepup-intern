import { paymentRepository, webhookEventRepository } from "@/modules/payments/payment.repository";
import { planRepository } from "@/modules/plans/plan.repository";
import { subscriptionRepository } from "@/modules/subscriptions/subscription.repository";
import { subscriptionService } from "@/modules/subscriptions/subscription.service";
import { invoiceService } from "@/modules/invoices/invoice.service";
import { razorpayClient } from "@/payments/razorpay.client";
import { webhookHandler, type RazorpayWebhookEvent } from "@/payments/webhook.handler";
import { mapRazorpaySubscriptionStatus } from "@/payments/subscription.service";
import { getRazorpayConfig } from "@/config/razorpay.config";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import { createModuleLogger } from "@/config/logger.config";
import { minutesFromNow } from "@/shared/utils/date";

const logger = createModuleLogger("payment.service");

const CURRENCY = "INR";
const BILLING_PERIOD_MINUTES = 60 * 24 * 30; // 30-day billing period for order-based (non-recurring) upgrades

export const paymentService = {
  async createCheckoutOrder(userId: string, planId: string) {
    const plan = await planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError("Plan not found");
    }
    if (plan.tier !== "premium") {
      throw new ValidationError("Only premium plans require checkout");
    }

    const subscription = await subscriptionRepository.findByUserId(userId);

    const receipt = `sub_${userId}_${Date.now()}`;
    const order = await razorpayClient.createOrder({
      amountInPaise: plan.priceInPaise,
      currency: CURRENCY,
      receipt,
      notes: { userId, planId },
    });

    const payment = await paymentRepository.create({
      userId,
      subscriptionId: subscription ? String(subscription._id) : null,
      planId,
      razorpayOrderId: order.id,
      amountInPaise: plan.priceInPaise,
      currency: CURRENCY,
    });

    const config = getRazorpayConfig();

    logger.info({ userId, planId, orderId: order.id }, "Checkout order created");

    return {
      paymentId: String(payment._id),
      razorpayOrderId: order.id,
      razorpayKeyId: config.RAZORPAY_KEY_ID,
      amountInPaise: plan.priceInPaise,
      currency: CURRENCY,
    };
  },

  async getHistory(userId: string, cursor: string | undefined, limit: number) {
    const results = await paymentRepository.findByUser(userId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async getById(userId: string, paymentId: string) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment || String(payment.userId) !== userId) {
      throw new NotFoundError("Payment not found");
    }
    return payment;
  },

  /**
   * Single entry point for Razorpay webhook delivery. This is the ONLY
   * place subscriptions get activated — a frontend "payment succeeded"
   * callback is never trusted for entitlement changes, per the architecture.
   */
  async processWebhook(rawBody: string, signatureHeader: string | null): Promise<{ processed: boolean }> {
    const { event, dedupeKey } = webhookHandler.verifyAndParse(rawBody, signatureHeader);

    const isNewEvent = await webhookEventRepository.recordIfNew(dedupeKey, event.event);
    if (!isNewEvent) {
      logger.info({ dedupeKey }, "Duplicate webhook event ignored (already processed)");
      return { processed: false };
    }

    switch (event.event) {
      case "payment.captured":
        await this.handlePaymentCaptured(event);
        break;
      case "payment.failed":
        await this.handlePaymentFailed(event);
        break;
      case "subscription.activated":
      case "subscription.charged":
        await this.handleSubscriptionActivatedOrCharged(event);
        break;
      case "subscription.cancelled":
      case "subscription.halted":
        await this.handleSubscriptionCancelledOrHalted(event);
        break;
      default:
        logger.info({ eventType: event.event }, "Unhandled webhook event type (recorded, no action taken)");
    }

    return { processed: true };
  },

  async handlePaymentCaptured(event: RazorpayWebhookEvent): Promise<void> {
    const paymentEntity = event.payload.payment?.entity;
    if (!paymentEntity?.order_id) {
      logger.warn({ event: event.event }, "payment.captured event missing order_id; skipping");
      return;
    }

    const payment = await paymentRepository.findByRazorpayOrderId(paymentEntity.order_id);
    if (!payment) {
      logger.warn({ orderId: paymentEntity.order_id }, "payment.captured for unknown order; skipping");
      return;
    }

    await paymentRepository.markCaptured(paymentEntity.order_id, paymentEntity.id, null);

    if (payment.planId) {
      const periodStart = new Date();
      const periodEnd = minutesFromNow(BILLING_PERIOD_MINUTES);
      await subscriptionService.activate(String(payment.userId), String(payment.planId), periodStart, periodEnd);

      const updatedPayment = await paymentRepository.findByRazorpayOrderId(paymentEntity.order_id);
      if (updatedPayment) {
        await invoiceService.generateForPayment(updatedPayment);
      }
    }

    logger.info({ orderId: paymentEntity.order_id, userId: String(payment.userId) }, "Payment captured and processed");
  },

  async handlePaymentFailed(event: RazorpayWebhookEvent): Promise<void> {
    const paymentEntity = event.payload.payment?.entity;
    if (!paymentEntity?.order_id) return;

    await paymentRepository.markFailed(paymentEntity.order_id, paymentEntity.status);
    logger.warn({ orderId: paymentEntity.order_id }, "Payment failed");
  },

  async handleSubscriptionActivatedOrCharged(event: RazorpayWebhookEvent): Promise<void> {
    const subEntity = event.payload.subscription?.entity;
    if (!subEntity) return;

    const status = mapRazorpaySubscriptionStatus(subEntity.status);
    const periodStart = subEntity.current_start ? new Date(subEntity.current_start * 1000) : undefined;
    const periodEnd = subEntity.current_end ? new Date(subEntity.current_end * 1000) : undefined;

    await subscriptionService.updateStatusByRazorpaySubscriptionId(subEntity.id, status, periodStart, periodEnd);
    logger.info({ razorpaySubscriptionId: subEntity.id, status }, "Subscription status synced from webhook");
  },

  async handleSubscriptionCancelledOrHalted(event: RazorpayWebhookEvent): Promise<void> {
    const subEntity = event.payload.subscription?.entity;
    if (!subEntity) return;

    const status = mapRazorpaySubscriptionStatus(subEntity.status);
    await subscriptionService.updateStatusByRazorpaySubscriptionId(subEntity.id, status);
    logger.info({ razorpaySubscriptionId: subEntity.id, status }, "Subscription cancelled/halted via webhook");
  },
};

export type PaymentService = typeof paymentService;

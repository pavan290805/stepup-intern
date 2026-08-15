import { PaymentModel, type PaymentStatus } from "@/database/models/payment.model";
import { WebhookEventModel } from "@/database/models/webhook-event.model";

export interface CreatePaymentData {
  userId: string;
  subscriptionId: string | null;
  planId: string | null;
  razorpayOrderId: string;
  amountInPaise: number;
  currency: string;
}

export const paymentRepository = {
  async create(data: CreatePaymentData) {
    const payment = await PaymentModel.create({ ...data, status: "created" });
    return payment.toObject();
  },

  async findById(id: string) {
    return PaymentModel.findById(id).lean().exec();
  },

  async findByRazorpayOrderId(razorpayOrderId: string) {
    return PaymentModel.findOne({ razorpayOrderId }).lean().exec();
  },

  async findByRazorpayPaymentId(razorpayPaymentId: string) {
    return PaymentModel.findOne({ razorpayPaymentId }).lean().exec();
  },

  async findByUser(userId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { userId };
    if (cursor) query._id = { $lt: cursor };

    return PaymentModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async markCaptured(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string | null) {
    return PaymentModel.findOneAndUpdate(
      { razorpayOrderId },
      { status: "captured", razorpayPaymentId, razorpaySignature },
      { new: true }
    )
      .lean()
      .exec();
  },

  async markFailed(razorpayOrderId: string, reason: string) {
    return PaymentModel.findOneAndUpdate(
      { razorpayOrderId },
      { status: "failed", failureReason: reason },
      { new: true }
    )
      .lean()
      .exec();
  },

  async updateStatus(razorpayOrderId: string, status: PaymentStatus) {
    return PaymentModel.findOneAndUpdate({ razorpayOrderId }, { status }, { new: true }).lean().exec();
  },

  async recordRefund(paymentId: string, refundedAmountInPaise: number) {
    return PaymentModel.findByIdAndUpdate(
      paymentId,
      { status: "refunded", refundedAmountInPaise },
      { new: true }
    )
      .lean()
      .exec();
  },

  /** Admin-facing: most recent payments across all users, for dashboard visibility. */
  async findRecent(limit: number) {
    return PaymentModel.find({}).sort({ _id: -1 }).limit(limit).lean().exec();
  },
};

export type PaymentRepository = typeof paymentRepository;

export const webhookEventRepository = {
  /** Returns true if this is a NEW event (and records it atomically); false if already processed. */
  async recordIfNew(razorpayEventId: string, eventType: string): Promise<boolean> {
    try {
      await WebhookEventModel.create({ razorpayEventId, eventType });
      return true;
    } catch (error) {
      // Duplicate key error (code 11000) means this event was already processed.
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000) {
        return false;
      }
      throw error;
    }
  },
};

export type WebhookEventRepository = typeof webhookEventRepository;

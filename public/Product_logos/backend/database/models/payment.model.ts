import { Schema, model, models, type Model } from "mongoose";

export const PAYMENT_STATUSES = ["created", "authorized", "captured", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PURPOSES = ["subscription", "event"] as const;
export type PaymentPurpose = (typeof PAYMENT_PURPOSES)[number];

export interface IPayment {
  userId: Schema.Types.ObjectId;
  subscriptionId: Schema.Types.ObjectId | null;
  planId: Schema.Types.ObjectId | null;
  purpose: PaymentPurpose;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amountInPaise: number;
  currency: string;
  status: PaymentStatus;
  refundedAmountInPaise: number;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", default: null },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    purpose: { type: String, enum: PAYMENT_PURPOSES, required: true, default: "subscription" },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null, select: false },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: { type: String, enum: PAYMENT_STATUSES, default: "created" },
    refundedAmountInPaise: { type: Number, default: 0 },
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayOrderId: 1 }, { unique: true });
paymentSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ userId: 1, createdAt: -1 });

export const PaymentModel: Model<IPayment> = models.Payment ?? model<IPayment>("Payment", paymentSchema);

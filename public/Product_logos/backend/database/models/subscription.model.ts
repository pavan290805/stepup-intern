import { Schema, model, models, type Model } from "mongoose";

export const SUBSCRIPTION_STATUSES = ["pending", "active", "cancelled", "expired", "past_due"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export interface ISubscription {
  userId: Schema.Types.ObjectId;
  planId: Schema.Types.ObjectId;
  status: SubscriptionStatus;
  razorpaySubscriptionId: string | null;
  razorpayCustomerId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    status: { type: String, enum: SUBSCRIPTION_STATUSES, default: "pending" },
    razorpaySubscriptionId: { type: String, default: null },
    razorpayCustomerId: { type: String, default: null },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// A user has exactly one subscription record at a time (upgrades/downgrades
// mutate this record rather than creating a new one) so premium checks are
// a single indexed lookup.
subscriptionSchema.index({ userId: 1 }, { unique: true });
subscriptionSchema.index({ razorpaySubscriptionId: 1 }, { unique: true, sparse: true });
subscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });

export const SubscriptionModel: Model<ISubscription> =
  models.Subscription ?? model<ISubscription>("Subscription", subscriptionSchema);

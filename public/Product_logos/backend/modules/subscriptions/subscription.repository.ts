import { SubscriptionModel, type SubscriptionStatus } from "@/database/models/subscription.model";

export interface CreateSubscriptionData {
  userId: string;
  planId: string;
  razorpaySubscriptionId?: string | null;
  razorpayCustomerId?: string | null;
  status?: SubscriptionStatus;
}

export const subscriptionRepository = {
  async findByUserId(userId: string) {
    return SubscriptionModel.findOne({ userId }).lean().exec();
  },

  async findById(id: string) {
    return SubscriptionModel.findById(id).lean().exec();
  },

  async findByRazorpaySubscriptionId(razorpaySubscriptionId: string) {
    return SubscriptionModel.findOne({ razorpaySubscriptionId }).lean().exec();
  },

  async upsertForUser(userId: string, data: CreateSubscriptionData) {
    return SubscriptionModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async updatePlan(userId: string, planId: string, status: SubscriptionStatus) {
    return SubscriptionModel.findOneAndUpdate({ userId }, { planId, status }, { new: true }).lean().exec();
  },

  async updateStatus(userId: string, status: SubscriptionStatus) {
    return SubscriptionModel.findOneAndUpdate({ userId }, { status }, { new: true }).lean().exec();
  },

  async updateBillingPeriod(userId: string, currentPeriodStart: Date, currentPeriodEnd: Date, status: SubscriptionStatus) {
    return SubscriptionModel.findOneAndUpdate(
      { userId },
      { currentPeriodStart, currentPeriodEnd, status },
      { new: true }
    )
      .lean()
      .exec();
  },

  async setCancelAtPeriodEnd(userId: string, cancelAtPeriodEnd: boolean) {
    return SubscriptionModel.findOneAndUpdate({ userId }, { cancelAtPeriodEnd }, { new: true }).lean().exec();
  },

  async markCancelled(userId: string) {
    return SubscriptionModel.findOneAndUpdate(
      { userId },
      { status: "cancelled", cancelledAt: new Date(), cancelAtPeriodEnd: false },
      { new: true }
    )
      .lean()
      .exec();
  },

  async findExpiredActive(now: Date) {
    return SubscriptionModel.find({ status: "active", currentPeriodEnd: { $lt: now } })
      .lean()
      .exec();
  },

  async markExpired(userId: string) {
    return SubscriptionModel.findOneAndUpdate({ userId }, { status: "expired" }, { new: true }).lean().exec();
  },

  async updateByRazorpaySubscriptionId(
    razorpaySubscriptionId: string,
    data: Partial<{ status: SubscriptionStatus; currentPeriodStart: Date; currentPeriodEnd: Date }>
  ) {
    return SubscriptionModel.findOneAndUpdate({ razorpaySubscriptionId }, data, { new: true }).lean().exec();
  },
};

export type SubscriptionRepository = typeof subscriptionRepository;

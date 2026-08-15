import { Schema, model, models, type Model } from "mongoose";

export interface IWebhookEvent {
  razorpayEventId: string;
  eventType: string;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    razorpayEventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    processedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

// Enforces exactly-once processing: Razorpay may deliver the same webhook
// more than once (retries on timeout), so this unique index is the
// idempotency guard checked before any subscription/payment state changes.
webhookEventSchema.index({ razorpayEventId: 1 }, { unique: true });

export const WebhookEventModel: Model<IWebhookEvent> =
  models.WebhookEvent ?? model<IWebhookEvent>("WebhookEvent", webhookEventSchema);

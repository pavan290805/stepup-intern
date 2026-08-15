import { Schema, model, models, type Model } from "mongoose";

export const REGISTRATION_STATUSES = ["registered", "waitlisted", "cancelled", "attended", "no_show"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export interface IEventRegistration {
  eventId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
  cancelledAt: Date | null;
  attendedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: REGISTRATION_STATUSES, default: "registered" },
    registeredAt: { type: Date, required: true, default: () => new Date() },
    cancelledAt: { type: Date, default: null },
    attendedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevents duplicate registrations: a user can only have one active
// registration record per event (re-registering after cancellation updates
// this same document rather than inserting a new one).
eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
eventRegistrationSchema.index({ eventId: 1, status: 1 });
eventRegistrationSchema.index({ userId: 1, createdAt: -1 });

export const EventRegistrationModel: Model<IEventRegistration> =
  models.EventRegistration ?? model<IEventRegistration>("EventRegistration", eventRegistrationSchema);

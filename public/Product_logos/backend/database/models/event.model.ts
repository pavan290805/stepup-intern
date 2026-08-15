import { Schema, model, models, type Model } from "mongoose";

export const EVENT_TYPES = [
  "webinar",
  "hackathon",
  "workshop",
  "bootcamp",
  "seminar",
  "founder-talk",
  "podcast",
  "networking",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_STATUSES = ["draft", "published", "cancelled", "archived"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface IEvent {
  title: string;
  description: string;
  type: EventType;
  organizerId: Schema.Types.ObjectId;
  status: EventStatus;
  startAt: Date;
  endAt: Date;
  location: string;
  isOnline: boolean;
  capacity: number | null;
  registeredCount: number;
  waitlistCount: number;
  isFeatured: boolean;
  tags: string[];
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: EVENT_TYPES, required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: EVENT_STATUSES, default: "draft" },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    location: { type: String, required: true },
    isOnline: { type: Boolean, default: true },
    capacity: { type: Number, default: null },
    registeredCount: { type: Number, default: 0 },
    waitlistCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    category: { type: String, default: null },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ type: 1, status: 1 });
eventSchema.index({ isFeatured: 1, status: 1 });
eventSchema.index({ title: "text", description: "text", tags: "text" });

export const EventModel: Model<IEvent> = models.Event ?? model<IEvent>("Event", eventSchema);

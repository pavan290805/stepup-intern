import { eventBus } from "@/events/event-bus";
import { EVENT_NAMES } from "@/shared/constants/event-names";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("listener:event-registration");

export interface EventRegistrationCreatedPayload {
  userId: string;
  eventId: string;
  status: "registered" | "waitlisted";
}

export interface EventRegistrationCancelledPayload {
  userId: string;
  eventId: string;
}

export interface EventCancelledPayload {
  eventId: string;
  affectedUserIds: string[];
}

export interface EventWaitlistPromotedPayload {
  userId: string;
  eventId: string;
}

/**
 * Architecture-only: records that a notification-worthy event occurred.
 * Wiring an actual email/push provider (Resend, etc.) is a later phase —
 * this only proves the hook points exist and fire correctly.
 */
export function registerEventRegistrationListeners(): void {
  eventBus.on(EVENT_NAMES.EVENT_REGISTRATION_CREATED, (payload: EventRegistrationCreatedPayload) => {
    logger.info({ payload }, "Would send registration confirmation notification");
  });

  eventBus.on(EVENT_NAMES.EVENT_REGISTRATION_CANCELLED, (payload: EventRegistrationCancelledPayload) => {
    logger.info({ payload }, "Would send registration cancellation notification");
  });

  eventBus.on(EVENT_NAMES.EVENT_CANCELLED, (payload: EventCancelledPayload) => {
    logger.info({ payload }, "Would notify all registrants of event cancellation");
  });

  eventBus.on(EVENT_NAMES.EVENT_WAITLIST_PROMOTED, (payload: EventWaitlistPromotedPayload) => {
    logger.info({ payload }, "Would notify user of waitlist promotion");
  });

  eventBus.on(EVENT_NAMES.EVENT_REMINDER_DUE, (payload: { eventId: string; userId: string }) => {
    logger.info({ payload }, "Would send event reminder notification");
  });
}

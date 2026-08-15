import { registrationRepository } from "@/modules/event-registrations/registration.repository";
import { eventRepository } from "@/modules/events/event.repository";
import { eventBus } from "@/events/event-bus";
import { EVENT_NAMES } from "@/shared/constants/event-names";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("registration.service");

export const registrationService = {
  async register(eventId: string, userId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event || event.status !== "published") {
      throw new NotFoundError("Event not found or not open for registration");
    }

    const existing = await registrationRepository.findByEventAndUser(eventId, userId);
    if (existing && existing.status !== "cancelled") {
      throw new ConflictError("You are already registered for this event");
    }

    const isFull = event.capacity !== null && event.registeredCount >= event.capacity;
    const status = isFull ? "waitlisted" : "registered";

    const registration = existing
      ? await registrationRepository.reactivate(String(existing._id), status)
      : await registrationRepository.create(eventId, userId, status);

    if (status === "registered") {
      await eventRepository.incrementRegisteredCount(eventId, 1);
    } else {
      await eventRepository.incrementWaitlistCount(eventId, 1);
    }

    eventBus.publish(EVENT_NAMES.EVENT_REGISTRATION_CREATED, { userId, eventId, status });
    logger.info({ userId, eventId, status }, "Event registration created");

    return registration;
  },

  async cancel(eventId: string, userId: string) {
    const registration = await registrationRepository.findByEventAndUser(eventId, userId);
    if (!registration || registration.status === "cancelled") {
      throw new NotFoundError("Registration not found");
    }

    const wasRegistered = registration.status === "registered";
    const wasWaitlisted = registration.status === "waitlisted";

    await registrationRepository.cancel(String(registration._id));

    if (wasRegistered) {
      await eventRepository.incrementRegisteredCount(eventId, -1);
      await this.promoteFromWaitlist(eventId);
    } else if (wasWaitlisted) {
      await eventRepository.incrementWaitlistCount(eventId, -1);
    }

    eventBus.publish(EVENT_NAMES.EVENT_REGISTRATION_CANCELLED, { userId, eventId });
    logger.info({ userId, eventId }, "Event registration cancelled");

    return { cancelled: true };
  },

  async promoteFromWaitlist(eventId: string) {
    const nextInLine = await registrationRepository.findOldestWaitlisted(eventId);
    if (!nextInLine) return;

    await registrationRepository.reactivate(String(nextInLine._id), "registered");
    await eventRepository.incrementRegisteredCount(eventId, 1);
    await eventRepository.incrementWaitlistCount(eventId, -1);

    eventBus.publish(EVENT_NAMES.EVENT_WAITLIST_PROMOTED, {
      userId: String(nextInLine.userId),
      eventId,
    });
    logger.info({ eventId, userId: String(nextInLine.userId) }, "Waitlisted registrant promoted");
  },

  async markAttendance(eventId: string, organizerId: string, targetUserId: string) {
    const event = await eventRepository.findByIdAndOrganizer(eventId, organizerId);
    if (!event) {
      throw new ForbiddenError("You do not have access to this event's attendance records");
    }

    const registration = await registrationRepository.findByEventAndUser(eventId, targetUserId);
    if (!registration || registration.status !== "registered") {
      throw new ValidationError("This user does not have an active registration for this event");
    }

    return registrationRepository.markAttended(String(registration._id));
  },

  async getForEvent(eventId: string, organizerId: string, cursor: string | undefined, limit: number, status?: string) {
    const event = await eventRepository.findByIdAndOrganizer(eventId, organizerId);
    if (!event) {
      throw new ForbiddenError("You do not have access to this event's registrations");
    }

    const results = await registrationRepository.findByEvent(eventId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async getHistoryForUser(userId: string, cursor: string | undefined, limit: number, status?: string) {
    const results = await registrationRepository.findByUser(userId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },
};

export type RegistrationService = typeof registrationService;

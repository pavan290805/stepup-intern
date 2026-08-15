import { eventRepository } from "@/modules/events/event.repository";
import { eventBus } from "@/events/event-bus";
import { EVENT_NAMES } from "@/shared/constants/event-names";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type { CreateEventDto, EventSearchQuery, UpdateEventDto } from "@/modules/events/event.validators";

async function assertOwnership(eventId: string, organizerId: string) {
  const event = await eventRepository.findByIdAndOrganizer(eventId, organizerId);
  if (!event) {
    throw new ForbiddenError("You do not have access to this event");
  }
  return event;
}

export const eventService = {
  async create(organizerId: string, data: CreateEventDto) {
    return eventRepository.create(organizerId, data);
  },

  async update(eventId: string, organizerId: string, data: UpdateEventDto) {
    await assertOwnership(eventId, organizerId);
    const updated = await eventRepository.update(eventId, data);
    if (!updated) throw new NotFoundError("Event not found");
    return updated;
  },

  async publish(eventId: string, organizerId: string) {
    const event = await assertOwnership(eventId, organizerId);
    if (!event.title || !event.description || !event.startAt) {
      throw new ValidationError("Event must have a title, description, and start time before publishing");
    }
    return eventRepository.updateStatus(eventId, "published");
  },

  async cancel(eventId: string, organizerId: string) {
    await assertOwnership(eventId, organizerId);
    const cancelled = await eventRepository.updateStatus(eventId, "cancelled");

    eventBus.publish(EVENT_NAMES.EVENT_CANCELLED, { eventId, affectedUserIds: [] });
    return cancelled;
  },

  async archive(eventId: string, organizerId: string) {
    await assertOwnership(eventId, organizerId);
    return eventRepository.updateStatus(eventId, "archived");
  },

  async delete(eventId: string, organizerId: string) {
    await assertOwnership(eventId, organizerId);
    return eventRepository.delete(eventId);
  },

  async getById(eventId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event || event.status === "draft") {
      throw new NotFoundError("Event not found");
    }
    return event;
  },

  async getForOrganizer(eventId: string, organizerId: string) {
    return assertOwnership(eventId, organizerId);
  },

  async search(query: EventSearchQuery) {
    const results = await eventRepository.search(
      { type: query.type, category: query.category, featured: query.featured, textQuery: query.q },
      query.cursor,
      query.limit
    );
    return buildPaginatedResult(results, query.limit);
  },

  async listForOrganizer(organizerId: string, cursor: string | undefined, limit: number) {
    const results = await eventRepository.findByOrganizer(organizerId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },
};

export type EventService = typeof eventService;

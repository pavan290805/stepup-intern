import { EventModel, type EventStatus } from "@/database/models/event.model";
import type { CreateEventDto, UpdateEventDto } from "@/modules/events/event.validators";

export interface EventFilters {
  status?: EventStatus;
  type?: string;
  category?: string;
  featured?: boolean;
  textQuery?: string;
}

export const eventRepository = {
  async create(organizerId: string, data: CreateEventDto) {
    const event = await EventModel.create({ ...data, organizerId, status: "draft" });
    return event.toObject();
  },

  async findById(id: string) {
    return EventModel.findById(id).lean().exec();
  },

  async findByIdAndOrganizer(id: string, organizerId: string) {
    return EventModel.findOne({ _id: id, organizerId }).lean().exec();
  },

  async update(id: string, data: UpdateEventDto) {
    return EventModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  },

  async updateStatus(id: string, status: EventStatus) {
    return EventModel.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
  },

  async delete(id: string) {
    return EventModel.findByIdAndDelete(id).lean().exec();
  },

  async incrementRegisteredCount(id: string, delta: 1 | -1) {
    return EventModel.findByIdAndUpdate(id, { $inc: { registeredCount: delta } }, { new: true }).lean().exec();
  },

  async incrementWaitlistCount(id: string, delta: 1 | -1) {
    return EventModel.findByIdAndUpdate(id, { $inc: { waitlistCount: delta } }, { new: true }).lean().exec();
  },

  async search(filters: EventFilters, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { status: filters.status ?? "published" };

    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.featured !== undefined) query.isFeatured = filters.featured;
    if (filters.textQuery) query.$text = { $search: filters.textQuery };
    if (cursor) query._id = { $lt: cursor };

    return EventModel.find(query)
      .sort({ startAt: 1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByOrganizer(organizerId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { organizerId };
    if (cursor) query._id = { $lt: cursor };

    return EventModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type EventRepository = typeof eventRepository;

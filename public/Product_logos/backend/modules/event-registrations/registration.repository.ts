import { EventRegistrationModel, type RegistrationStatus } from "@/database/models/event-registration.model";

export const registrationRepository = {
  async create(eventId: string, userId: string, status: RegistrationStatus) {
    const registration = await EventRegistrationModel.create({ eventId, userId, status, registeredAt: new Date() });
    return registration.toObject();
  },

  async findByEventAndUser(eventId: string, userId: string) {
    return EventRegistrationModel.findOne({ eventId, userId }).lean().exec();
  },

  async findById(id: string) {
    return EventRegistrationModel.findById(id).lean().exec();
  },

  async reactivate(id: string, status: RegistrationStatus) {
    return EventRegistrationModel.findByIdAndUpdate(
      id,
      { status, registeredAt: new Date(), cancelledAt: null },
      { new: true }
    )
      .lean()
      .exec();
  },

  async cancel(id: string) {
    return EventRegistrationModel.findByIdAndUpdate(id, { status: "cancelled", cancelledAt: new Date() }, { new: true })
      .lean()
      .exec();
  },

  async markAttended(id: string) {
    return EventRegistrationModel.findByIdAndUpdate(id, { status: "attended", attendedAt: new Date() }, { new: true })
      .lean()
      .exec();
  },

  async countByEventAndStatus(eventId: string, status: RegistrationStatus): Promise<number> {
    return EventRegistrationModel.countDocuments({ eventId, status }).exec();
  },

  async findOldestWaitlisted(eventId: string) {
    return EventRegistrationModel.findOne({ eventId, status: "waitlisted" }).sort({ registeredAt: 1 }).lean().exec();
  },

  async findByEvent(eventId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { eventId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return EventRegistrationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByUser(userId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { userId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return EventRegistrationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type RegistrationRepository = typeof registrationRepository;

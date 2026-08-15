import { MentorProfileModel } from "@/database/models/mentor-profile.model";
import { MentorSessionModel, type MentorSessionStatus } from "@/database/models/mentor-session.model";
import { MentorPointsLedgerModel } from "@/database/models/mentor-points.model";
import type { RequestSessionDto, UpsertMentorProfileDto } from "@/modules/mentors/mentor.validators";

export const mentorRepository = {
  async findProfileByUserId(userId: string) {
    return MentorProfileModel.findOne({ userId }).lean().exec();
  },

  async upsertProfile(userId: string, data: UpsertMentorProfileDto) {
    return MentorProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async incrementPoints(userId: string, points: number) {
    return MentorProfileModel.findOneAndUpdate({ userId }, { $inc: { totalPoints: points } }, { new: true })
      .lean()
      .exec();
  },

  async recordReview(userId: string, rating: number) {
    const profile = await MentorProfileModel.findOne({ userId }).exec();
    if (!profile) return null;

    const newTotalReviews = profile.totalReviews + 1;
    const newAverage = (profile.averageRating * profile.totalReviews + rating) / newTotalReviews;

    profile.totalReviews = newTotalReviews;
    profile.averageRating = Number(newAverage.toFixed(2));
    await profile.save();
    return profile.toObject();
  },
};

export const mentorSessionRepository = {
  async create(studentId: string, data: RequestSessionDto) {
    const session = await MentorSessionModel.create({ ...data, studentId, status: "requested" });
    return session.toObject();
  },

  async findById(id: string) {
    return MentorSessionModel.findById(id).lean().exec();
  },

  async updateStatus(id: string, status: MentorSessionStatus) {
    return MentorSessionModel.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
  },

  async complete(id: string, pointsAwarded: number) {
    return MentorSessionModel.findByIdAndUpdate(id, { status: "completed", pointsAwarded }, { new: true })
      .lean()
      .exec();
  },

  async submitReview(id: string, rating: number, review: string | undefined) {
    return MentorSessionModel.findByIdAndUpdate(
      id,
      { rating, review: review ?? null, reviewedAt: new Date() },
      { new: true }
    )
      .lean()
      .exec();
  },

  async findByMentor(mentorId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { mentorId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return MentorSessionModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByStudent(studentId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { studentId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return MentorSessionModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export const mentorPointsRepository = {
  async record(mentorId: string, sessionId: string | null, points: number, reason: string) {
    const entry = await MentorPointsLedgerModel.create({ mentorId, sessionId, points, reason });
    return entry.toObject();
  },

  async findByMentor(mentorId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { mentorId };
    if (cursor) query._id = { $lt: cursor };

    return MentorPointsLedgerModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type MentorRepository = typeof mentorRepository;
export type MentorSessionRepository = typeof mentorSessionRepository;
export type MentorPointsRepository = typeof mentorPointsRepository;

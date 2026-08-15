import { mentorRepository, mentorSessionRepository, mentorPointsRepository } from "@/modules/mentors/mentor.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type { RequestSessionDto, SubmitReviewDto, UpsertMentorProfileDto } from "@/modules/mentors/mentor.validators";

const POINTS_PER_COMPLETED_SESSION = 10;

export const mentorService = {
  async getProfile(userId: string) {
    const profile = await mentorRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Mentor profile not found. Complete your profile first.");
    }
    return profile;
  },

  async upsertProfile(userId: string, data: UpsertMentorProfileDto) {
    return mentorRepository.upsertProfile(userId, data);
  },

  async requestSession(studentId: string, data: RequestSessionDto) {
    const mentorProfile = await mentorRepository.findProfileByUserId(data.mentorId);
    if (!mentorProfile || !mentorProfile.isAcceptingSessions) {
      throw new NotFoundError("This mentor is not currently accepting session requests");
    }

    return mentorSessionRepository.create(studentId, data);
  },

  async confirmSession(sessionId: string, mentorId: string) {
    const session = await mentorSessionRepository.findById(sessionId);
    if (!session || String(session.mentorId) !== mentorId) {
      throw new ForbiddenError("You do not have access to this session");
    }
    if (session.status !== "requested") {
      throw new ValidationError(`Cannot confirm a session with status "${session.status}"`);
    }
    return mentorSessionRepository.updateStatus(sessionId, "confirmed");
  },

  async completeSession(sessionId: string, mentorId: string) {
    const session = await mentorSessionRepository.findById(sessionId);
    if (!session || String(session.mentorId) !== mentorId) {
      throw new ForbiddenError("You do not have access to this session");
    }
    if (session.status !== "confirmed") {
      throw new ValidationError(`Cannot complete a session with status "${session.status}"`);
    }

    const completed = await mentorSessionRepository.complete(sessionId, POINTS_PER_COMPLETED_SESSION);
    await mentorRepository.incrementPoints(mentorId, POINTS_PER_COMPLETED_SESSION);
    await mentorPointsRepository.record(mentorId, sessionId, POINTS_PER_COMPLETED_SESSION, "Session completed");

    return completed;
  },

  async cancelSession(sessionId: string, userId: string) {
    const session = await mentorSessionRepository.findById(sessionId);
    if (!session || (String(session.mentorId) !== userId && String(session.studentId) !== userId)) {
      throw new ForbiddenError("You do not have access to this session");
    }
    if (session.status === "completed" || session.status === "cancelled") {
      throw new ValidationError(`Cannot cancel a session with status "${session.status}"`);
    }
    return mentorSessionRepository.updateStatus(sessionId, "cancelled");
  },

  async submitReview(sessionId: string, studentId: string, data: SubmitReviewDto) {
    const session = await mentorSessionRepository.findById(sessionId);
    if (!session || String(session.studentId) !== studentId) {
      throw new ForbiddenError("You do not have access to this session");
    }
    if (session.status !== "completed") {
      throw new ValidationError("Only completed sessions can be reviewed");
    }
    if (session.rating !== null) {
      throw new ValidationError("This session has already been reviewed");
    }

    const updated = await mentorSessionRepository.submitReview(sessionId, data.rating, data.review);
    await mentorRepository.recordReview(String(session.mentorId), data.rating);

    return updated;
  },

  async getSessionsForMentor(mentorId: string, cursor: string | undefined, limit: number, status?: string) {
    const results = await mentorSessionRepository.findByMentor(mentorId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async getSessionsForStudent(studentId: string, cursor: string | undefined, limit: number, status?: string) {
    const results = await mentorSessionRepository.findByStudent(studentId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async getPointsHistory(mentorId: string, cursor: string | undefined, limit: number) {
    const results = await mentorPointsRepository.findByMentor(mentorId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async getDashboard(mentorId: string) {
    const [profile, sessions] = await Promise.all([
      mentorRepository.findProfileByUserId(mentorId),
      mentorSessionRepository.findByMentor(mentorId, undefined, 200),
    ]);

    if (!profile) {
      throw new NotFoundError("Mentor profile not found. Complete your profile first.");
    }

    const completedCount = sessions.filter((s) => s.status === "completed").length;
    const upcomingCount = sessions.filter((s) => s.status === "confirmed").length;

    return {
      totalPoints: profile.totalPoints,
      averageRating: profile.averageRating,
      totalReviews: profile.totalReviews,
      completedSessions: completedCount,
      upcomingSessions: upcomingCount,
    };
  },
};

export type MentorService = typeof mentorService;

import type { NextRequest } from "next/server";
import { mentorService } from "@/modules/mentors/mentor.service";
import {
  requestSessionSchema,
  sessionListQuerySchema,
  submitReviewSchema,
  upsertMentorProfileSchema,
} from "@/modules/mentors/mentor.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const mentorController = {
  async getProfile(request: NextRequest, context: AuthContext) {
    const profile = await mentorService.getProfile(context.user.id);
    return ApiResponse.success(profile, "Mentor profile retrieved");
  },

  async upsertProfile(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = upsertMentorProfileSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid profile payload", parsed.error.flatten());

    const profile = await mentorService.upsertProfile(context.user.id, parsed.data);
    return ApiResponse.success(profile, "Mentor profile saved");
  },

  async requestSession(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = requestSessionSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid session payload", parsed.error.flatten());

    const session = await mentorService.requestSession(context.user.id, parsed.data);
    return ApiResponse.created(session, "Session requested");
  },

  async confirmSession(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Session id is required");

    const session = await mentorService.confirmSession(id, context.user.id);
    return ApiResponse.success(session, "Session confirmed");
  },

  async completeSession(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Session id is required");

    const session = await mentorService.completeSession(id, context.user.id);
    return ApiResponse.success(session, "Session marked complete");
  },

  async cancelSession(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Session id is required");

    const session = await mentorService.cancelSession(id, context.user.id);
    return ApiResponse.success(session, "Session cancelled");
  },

  async submitReview(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Session id is required");

    const body = await parseJsonBody(request);
    const parsed = submitReviewSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid review payload", parsed.error.flatten());

    const session = await mentorService.submitReview(id, context.user.id, parsed.data);
    return ApiResponse.success(session, "Review submitted");
  },

  async sessionsForMentor(request: NextRequest, context: AuthContext) {
    const parsed = sessionListQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await mentorService.getSessionsForMentor(
      context.user.id,
      parsed.data.cursor,
      parsed.data.limit,
      parsed.data.status
    );
    return ApiResponse.success(result, "Sessions retrieved");
  },

  async sessionsForStudent(request: NextRequest, context: AuthContext) {
    const parsed = sessionListQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await mentorService.getSessionsForStudent(
      context.user.id,
      parsed.data.cursor,
      parsed.data.limit,
      parsed.data.status
    );
    return ApiResponse.success(result, "Session history retrieved");
  },

  async pointsHistory(request: NextRequest, context: AuthContext) {
    const parsed = sessionListQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await mentorService.getPointsHistory(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Points history retrieved");
  },

  async dashboard(request: NextRequest, context: AuthContext) {
    const result = await mentorService.getDashboard(context.user.id);
    return ApiResponse.success(result, "Mentor dashboard retrieved");
  },
};

import type { NextRequest } from "next/server";
import { registrationService } from "@/modules/event-registrations/registration.service";
import { markAttendanceSchema, registrationHistoryQuerySchema } from "@/modules/event-registrations/registration.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const registrationController = {
  async register(request: NextRequest, context: AuthContext) {
    const eventId = context.params?.id;
    if (!eventId) throw new ValidationError("Event id is required");

    const registration = await registrationService.register(eventId, context.user.id);
    return ApiResponse.created(registration, "Registered for event");
  },

  async cancel(request: NextRequest, context: AuthContext) {
    const eventId = context.params?.id;
    if (!eventId) throw new ValidationError("Event id is required");

    const result = await registrationService.cancel(eventId, context.user.id);
    return ApiResponse.success(result, "Registration cancelled");
  },

  async markAttendance(request: NextRequest, context: AuthContext) {
    const eventId = context.params?.id;
    if (!eventId) throw new ValidationError("Event id is required");

    const body = await parseJsonBody(request);
    const parsed = markAttendanceSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await registrationService.markAttendance(eventId, context.user.id, parsed.data.userId);
    return ApiResponse.success(result, "Attendance marked");
  },

  async getForEvent(request: NextRequest, context: AuthContext) {
    const eventId = context.params?.id;
    if (!eventId) throw new ValidationError("Event id is required");

    const parsed = registrationHistoryQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await registrationService.getForEvent(
      eventId,
      context.user.id,
      parsed.data.cursor,
      parsed.data.limit,
      parsed.data.status
    );
    return ApiResponse.success(result, "Event registrations retrieved");
  },

  async history(request: NextRequest, context: AuthContext) {
    const parsed = registrationHistoryQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await registrationService.getHistoryForUser(
      context.user.id,
      parsed.data.cursor,
      parsed.data.limit,
      parsed.data.status
    );
    return ApiResponse.success(result, "Registration history retrieved");
  },
};

import type { NextRequest } from "next/server";
import { eventService } from "@/modules/events/event.service";
import { createEventSchema, eventSearchQuerySchema, updateEventSchema } from "@/modules/events/event.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const eventController = {
  async search(request: NextRequest) {
    const parsed = eventSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid search parameters", parsed.error.flatten());

    const result = await eventService.search(parsed.data);
    return ApiResponse.success(result, "Events retrieved");
  },

  async getById(request: NextRequest, context: { params?: Record<string, string> }) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const event = await eventService.getById(id);
    return ApiResponse.success(event, "Event retrieved");
  },

  async create(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid event payload", parsed.error.flatten());

    const event = await eventService.create(context.user.id, parsed.data);
    return ApiResponse.created(event, "Event created as draft");
  },

  async update(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const body = await parseJsonBody(request);
    const parsed = updateEventSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid event payload", parsed.error.flatten());

    const event = await eventService.update(id, context.user.id, parsed.data);
    return ApiResponse.success(event, "Event updated");
  },

  async publish(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const event = await eventService.publish(id, context.user.id);
    return ApiResponse.success(event, "Event published");
  },

  async cancel(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const event = await eventService.cancel(id, context.user.id);
    return ApiResponse.success(event, "Event cancelled");
  },

  async archive(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    const event = await eventService.archive(id, context.user.id);
    return ApiResponse.success(event, "Event archived");
  },

  async delete(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Event id is required");

    await eventService.delete(id, context.user.id);
    return ApiResponse.success(null, "Event deleted");
  },

  async listOwn(request: NextRequest, context: AuthContext) {
    const parsed = eventSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await eventService.listForOrganizer(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Your events retrieved");
  },
};

import type { NextRequest } from "next/server";
import { messageService } from "@/modules/messaging/message.service";
import { messageListQuerySchema, sendMessageSchema } from "@/modules/messaging/message.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const messageController = {
  async send(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid message payload", parsed.error.flatten());

    const message = await messageService.send(context.user.id, parsed.data.receiverId, parsed.data.content);
    return ApiResponse.created(message, "Message sent");
  },

  async getConversations(request: NextRequest, context: AuthContext) {
    const conversations = await messageService.getConversations(context.user.id);
    return ApiResponse.success(conversations, "Conversations retrieved");
  },

  async getThread(request: NextRequest, context: AuthContext) {
    const otherUserId = context.params?.userId;
    if (!otherUserId) throw new ValidationError("userId parameter is required");

    const parsed = messageListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await messageService.getThread(context.user.id, otherUserId, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Message thread retrieved");
  },
};

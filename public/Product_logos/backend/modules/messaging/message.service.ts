import { buildConversationId, messageRepository } from "@/modules/messaging/message.repository";
import { buildPaginatedResult } from "@/shared/response/pagination";
import { ValidationError } from "@/shared/errors";

export const messageService = {
  async send(senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) {
      throw new ValidationError("You cannot send a message to yourself");
    }

    const conversationId = buildConversationId(senderId, receiverId);
    return messageRepository.create(conversationId, senderId, receiverId, content);
  },

  async getThread(userId: string, otherUserId: string, cursor: string | undefined, limit: number) {
    const conversationId = buildConversationId(userId, otherUserId);
    await messageRepository.markRead(conversationId, userId);

    const results = await messageRepository.findByConversation(conversationId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async getConversations(userId: string) {
    return messageRepository.findConversationsForUser(userId);
  },
};

export type MessageService = typeof messageService;

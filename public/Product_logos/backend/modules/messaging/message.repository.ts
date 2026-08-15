import { MessageModel } from "@/database/models/message.model";

export function buildConversationId(userIdA: string, userIdB: string): string {
  return [userIdA, userIdB].sort().join(":");
}

export const messageRepository = {
  async create(conversationId: string, senderId: string, receiverId: string, content: string) {
    const message = await MessageModel.create({ conversationId, senderId, receiverId, content });
    return message.toObject();
  },

  async findByConversation(conversationId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { conversationId };
    if (cursor) query._id = { $lt: cursor };

    return MessageModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findConversationsForUser(userId: string) {
    return MessageModel.aggregate([
      { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$conversationId", lastMessage: { $first: "$$ROOT" } } },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]).exec();
  },

  async markRead(conversationId: string, receiverId: string) {
    return MessageModel.updateMany(
      { conversationId, receiverId, readAt: null },
      { readAt: new Date() }
    ).exec();
  },
};

export type MessageRepository = typeof messageRepository;

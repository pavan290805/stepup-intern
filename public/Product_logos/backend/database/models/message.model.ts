import { Schema, model, models, type Model } from "mongoose";

export interface IMessage {
  conversationId: string;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  content: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 5000 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, readAt: 1 });

export const MessageModel: Model<IMessage> = models.Message ?? model<IMessage>("Message", messageSchema);

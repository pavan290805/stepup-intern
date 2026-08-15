import { Schema, model, models, type Model } from "mongoose";
import { COMMUNITY_POST_STATUSES, type CommunityPostStatus } from "@/database/models/community-post.model";

export interface ICommunityComment {
  postId: Schema.Types.ObjectId;
  authorId: Schema.Types.ObjectId;
  parentCommentId: Schema.Types.ObjectId | null;
  content: string;
  status: CommunityPostStatus;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const communityCommentSchema = new Schema<ICommunityComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "CommunityPost", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "CommunityComment", default: null },
    content: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: COMMUNITY_POST_STATUSES, default: "published" },
    likeCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

communityCommentSchema.index({ postId: 1, createdAt: 1 });
communityCommentSchema.index({ parentCommentId: 1 });

export const CommunityCommentModel: Model<ICommunityComment> =
  models.CommunityComment ?? model<ICommunityComment>("CommunityComment", communityCommentSchema);

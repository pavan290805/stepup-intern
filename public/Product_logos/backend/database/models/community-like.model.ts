import { Schema, model, models, type Model } from "mongoose";

export const LIKE_TARGET_TYPES = ["post", "comment"] as const;
export type LikeTargetType = (typeof LIKE_TARGET_TYPES)[number];

export interface ICommunityLike {
  userId: Schema.Types.ObjectId;
  targetType: LikeTargetType;
  targetId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const communityLikeSchema = new Schema<ICommunityLike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: LIKE_TARGET_TYPES, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Prevents a user from liking the same post/comment twice.
communityLikeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
communityLikeSchema.index({ targetType: 1, targetId: 1 });

export const CommunityLikeModel: Model<ICommunityLike> =
  models.CommunityLike ?? model<ICommunityLike>("CommunityLike", communityLikeSchema);

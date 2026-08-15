import { Schema, model, models, type Model } from "mongoose";

export interface ICommunityBookmark {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const communityBookmarkSchema = new Schema<ICommunityBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "CommunityPost", required: true },
  },
  { timestamps: true }
);

communityBookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });
communityBookmarkSchema.index({ userId: 1, createdAt: -1 });

export const CommunityBookmarkModel: Model<ICommunityBookmark> =
  models.CommunityBookmark ?? model<ICommunityBookmark>("CommunityBookmark", communityBookmarkSchema);

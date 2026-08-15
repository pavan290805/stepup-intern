import { Schema, model, models, type Model } from "mongoose";

export interface ISession {
  userId: Schema.Types.ObjectId;
  sessionTokenHash: string;
  refreshTokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  refreshExpiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionTokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    expiresAt: { type: Date, required: true },
    refreshExpiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Sessions past their refresh window are irrelevant; auto-purge to keep the collection lean.
sessionSchema.index({ refreshExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel: Model<ISession> = models.Session ?? model<ISession>("Session", sessionSchema);

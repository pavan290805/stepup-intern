import { Schema, model, models, type Model } from "mongoose";

export interface IAuditLog {
  actorId: Schema.Types.ObjectId;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

export const AuditLogModel: Model<IAuditLog> = models.AuditLog ?? model<IAuditLog>("AuditLog", auditLogSchema);

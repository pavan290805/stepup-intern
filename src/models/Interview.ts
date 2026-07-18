import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  mode: 'online' | 'in_person' | 'phone';
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application ID is required'],
      unique: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },
    mode: {
      type: String,
      enum: ['online', 'in_person', 'phone'],
      required: [true, 'Interview mode is required'],
    },
    meetingLink: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    feedback: String,
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  { timestamps: true }
);

interviewSchema.index({ applicationId: 1 });
interviewSchema.index({ status: 1 });

const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;

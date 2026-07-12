import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
  internshipId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  status: string;
  recruiterNotes?: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    internshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship ID is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: [true, 'Student ID is required'],
    },
    resumeUrl: String,
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected',
        'withdrawn',
      ],
      default: 'applied',
    },
    recruiterNotes: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ studentId: 1 });
applicationSchema.index({ status: 1 });

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;

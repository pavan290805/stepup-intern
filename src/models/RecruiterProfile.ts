import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRecruiterProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  designation: string;
  phoneNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const recruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

recruiterProfileSchema.index({ userId: 1 });
recruiterProfileSchema.index({ companyId: 1 });

const RecruiterProfile: Model<IRecruiterProfile> =
  mongoose.models.RecruiterProfile || mongoose.model<IRecruiterProfile>('RecruiterProfile', recruiterProfileSchema);

export default RecruiterProfile;

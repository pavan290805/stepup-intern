import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  headline?: string;
  bio?: string;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: string[];
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  certifications: string[];
  achievements: string[];
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    headline: {
      type: String,
      maxlength: [100, 'Headline cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
      },
    ],
    skills: [String],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    certifications: [String],
    achievements: [String],
    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],
    resumeUrl: String,
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

studentProfileSchema.index({ userId: 1 });

const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', studentProfileSchema);

export default StudentProfile;

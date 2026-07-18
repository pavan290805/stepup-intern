import { INTERNSHIP_STATUS, WORK_MODES } from '@/constants';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInternship extends Document {
  recruiterId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  stipend: number;
  duration: string;
  openings: number;
  deadline: Date;
  featured: boolean;
  status: 'draft' | 'active' | 'closed';
  views: number;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'RecruiterProfile',
      required: [true, 'Recruiter ID is required'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    skillsRequired: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    workMode: {
      type: String,
      enum: Object.values(WORK_MODES),
      required: [true, 'Work mode is required'],
    },
    stipend: {
      type: Number,
      required: [true, 'Stipend is required'],
      min: [0, 'Stipend cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    openings: {
      type: Number,
      required: [true, 'Number of openings is required'],
      min: [1, 'Must have at least 1 opening'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(INTERNSHIP_STATUS),
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

internshipSchema.index({ companyId: 1 });
internshipSchema.index({ recruiterId: 1 });
internshipSchema.index({ status: 1 });
internshipSchema.index({ workMode: 1 });
internshipSchema.index({ location: 1 });
internshipSchema.index({ skillsRequired: 1 });

const Internship: Model<IInternship> =
  mongoose.models.Internship || mongoose.model<IInternship>('Internship', internshipSchema);

export default Internship;

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  website: string;
  logoUrl?: string;
  description: string;
  companySize: string;
  headquarters: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      maxlength: [50, 'Industry cannot exceed 50 characters'],
    },
    website: {
      type: String,
      required: [true, 'Website URL is required'],
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    logoUrl: String,
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    companySize: {
      type: String,
      enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
      required: true,
    },
    headquarters: {
      type: String,
      required: [true, 'Headquarters is required'],
      maxlength: [100, 'Headquarters cannot exceed 100 characters'],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ verificationStatus: 1 });

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;

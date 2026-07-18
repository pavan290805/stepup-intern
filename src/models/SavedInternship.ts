import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISavedInternship extends Document {
  studentId: mongoose.Types.ObjectId;
  internshipId: mongoose.Types.ObjectId;
  savedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const savedInternshipSchema = new Schema<ISavedInternship>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: [true, 'Student ID is required'],
    },
    internshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: [true, 'Internship ID is required'],
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Unique constraint on studentId + internshipId
savedInternshipSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });
savedInternshipSchema.index({ studentId: 1 });

const SavedInternship: Model<ISavedInternship> =
  mongoose.models.SavedInternship ||
  mongoose.model<ISavedInternship>('SavedInternship', savedInternshipSchema);

export default SavedInternship;

import SavedInternship, { ISavedInternship } from '@/models/SavedInternship';
import { PaginationQuery } from '@/types';

export const savedInternshipService = {
  async saveInternship(studentId: string, internshipId: string): Promise<ISavedInternship> {
    const existingSaved = await SavedInternship.findOne({ studentId, internshipId });
    if (existingSaved) {
      throw new Error('Internship already saved');
    }

    return SavedInternship.create({
      studentId,
      internshipId,
    });
  },

  async getSavedInternships(
    studentId: string,
    query: PaginationQuery
  ): Promise<{ internships: ISavedInternship[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const internships = await SavedInternship.find({ studentId })
      .populate({
        path: 'internshipId',
        populate: [
          { path: 'companyId', select: 'name logoUrl' },
          { path: 'recruiterId', select: 'designation' },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SavedInternship.countDocuments({ studentId });

    return { internships, total };
  },

  async removeSavedInternship(studentId: string, internshipId: string): Promise<void> {
    await SavedInternship.findOneAndDelete({ studentId, internshipId });
  },

  async isSaved(studentId: string, internshipId: string): Promise<boolean> {
    const savedInternship = await SavedInternship.exists({ studentId, internshipId });
    return Boolean(savedInternship);
  },
};

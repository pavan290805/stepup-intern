import { InternshipInput } from '@/lib/validations';
import Internship, { IInternship } from '@/models/Internship';
import { PaginationQuery } from '@/types';

export const internshipService = {
  async createInternship(recruiterId: string, input: InternshipInput & { companyId: string }): Promise<IInternship> {
    return Internship.create({
      ...input,
      recruiterId,
    });
  },

  async getInternships(query: any): Promise<{ internships: IInternship[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = { status: 'active' };

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    if (query.workMode) {
      filter.workMode = query.workMode;
    }

    if (query.company) {
      filter.companyId = query.company;
    }

    if (query.skills && query.skills.length > 0) {
      filter.skillsRequired = { $in: query.skills };
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    const internships = await Internship.find(filter)
      .populate('companyId', 'name logoUrl')
      .populate('recruiterId', 'designation')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Internship.countDocuments(filter);

    return { internships, total };
  },

  async getInternshipById(internshipId: string): Promise<IInternship | null> {
    const internship = await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('companyId')
      .populate('recruiterId');

    return internship;
  },

  async getInternshipsByRecruiterId(recruiterId: string, query: PaginationQuery): Promise<{
    internships: IInternship[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const internships = await Internship.find({ recruiterId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Internship.countDocuments({ recruiterId });

    return { internships, total };
  },

  async updateInternship(internshipId: string, input: Partial<InternshipInput>): Promise<IInternship | null> {
    return Internship.findByIdAndUpdate(internshipId, input, { new: true });
  },

  async updateInternshipStatus(internshipId: string, status: string): Promise<IInternship | null> {
    return Internship.findByIdAndUpdate(internshipId, { status }, { new: true });
  },

  async deleteInternship(internshipId: string): Promise<void> {
    await Internship.findByIdAndDelete(internshipId);
  },

  async getFeaturedInternships(limit: number = 5): Promise<IInternship[]> {
    return Internship.find({ featured: true, status: 'active' })
      .populate('companyId')
      .limit(limit)
      .sort({ views: -1 });
  },

  async getActiveInternshipsCount(): Promise<number> {
    return Internship.countDocuments({ status: 'active' });
  },

  async incrementApplicationCount(internshipId: string): Promise<void> {
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicationsCount: 1 } });
  },

  async decrementApplicationCount(internshipId: string): Promise<void> {
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicationsCount: -1 } });
  },
};

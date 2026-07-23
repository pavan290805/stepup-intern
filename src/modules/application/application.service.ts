import { ApplicationInput } from '@/lib/validations';
import Application, { IApplication } from '@/models/Application';
import { internshipService } from '@/modules/internship/internship.service';
import { PaginationQuery } from '@/types';

export const applicationService = {
  async createApplication(studentId: string, input: ApplicationInput): Promise<IApplication> {
    const existingApplication = await Application.findOne({
      internshipId: input.internshipId,
      studentId,
    });

    if (existingApplication) {
      throw new Error('You have already applied for this internship');
    }

    const application = await Application.create({
      internshipId: input.internshipId,
      studentId,
      resumeUrl: input.resumeUrl,
    });

    // Increment application count
    await internshipService.incrementApplicationCount(input.internshipId);

    return application;
  },

  async getMyApplications(
    studentId: string,
    query: PaginationQuery
  ): Promise<{ applications: IApplication[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ studentId })
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

    const total = await Application.countDocuments({ studentId });

    return { applications, total };
  },

  async getApplicationsByInternshipId(internshipId: string, query: PaginationQuery): Promise<{
    applications: IApplication[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ internshipId })
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email profilePicture',
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments({ internshipId });

    return { applications, total };
  },

  async updateApplicationStatus(
    applicationId: string,
    input: { status: string; recruiterNotes?: string }
  ): Promise<IApplication | null> {
    return Application.findByIdAndUpdate(applicationId, input, { new: true }).populate('internshipId');
  },

  async getApplicationById(applicationId: string): Promise<IApplication | null> {
    return Application.findById(applicationId)
      .populate({
        path: 'internshipId',
        populate: [
          { path: 'companyId', select: 'name logoUrl' },
          { path: 'recruiterId', select: 'designation' },
        ],
      })
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'name email profilePicture',
        },
      });
  },

  async withdrawApplication(applicationId: string): Promise<IApplication | null> {
    const application = await Application.findById(applicationId);

    if (!application) {
      throw new Error('Application not found');
    }

    await internshipService.decrementApplicationCount(application.internshipId.toString());

    return Application.findByIdAndUpdate(applicationId, { status: 'withdrawn' }, { new: true });
  },

  async deleteApplication(applicationId: string): Promise<void> {
    const application = await Application.findById(applicationId);

    if (application) {
      await internshipService.decrementApplicationCount(application.internshipId.toString());
    }

    await Application.findByIdAndDelete(applicationId);
  },

  async getApplicationsByStatus(status: string): Promise<IApplication[]> {
    return Application.find({ status }).populate('internshipId').populate('studentId');
  },
};

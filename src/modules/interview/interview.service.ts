import { InterviewInput } from '@/lib/validations';
import Interview, { IInterview } from '@/models/Interview';

export const interviewService = {
  async createInterview(input: InterviewInput): Promise<IInterview> {
    const existingInterview = await Interview.findOne({ applicationId: input.applicationId });

    if (existingInterview) {
      throw new Error('Interview already scheduled for this application');
    }

    return Interview.create(input);
  },

  async getInterviewById(interviewId: string): Promise<IInterview | null> {
    return Interview.findById(interviewId).populate('applicationId');
  },

  async getInterviewByApplicationId(applicationId: string): Promise<IInterview | null> {
    return Interview.findOne({ applicationId }).populate('applicationId');
  },

  async getInterviewsByApplicationIds(applicationIds: string[]): Promise<IInterview[]> {
    if (applicationIds.length === 0) {
      return [];
    }

    return Interview.find({ applicationId: { $in: applicationIds } })
      .populate({
        path: 'applicationId',
        populate: [
          { path: 'studentId' },
          { path: 'internshipId', populate: [{ path: 'companyId' }, { path: 'recruiterId' }] },
        ],
      })
      .sort({ scheduledAt: -1 });
  },

  async updateInterview(interviewId: string, input: any): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(interviewId, input, { new: true }).populate('applicationId');
  },

  async getUpcomingInterviews(limit: number = 10): Promise<IInterview[]> {
    return Interview.find({
      status: 'scheduled',
      scheduledAt: { $gte: new Date() },
    })
      .populate('applicationId')
      .sort({ scheduledAt: 1 })
      .limit(limit);
  },

  async completeInterview(interviewId: string, feedback: string, rating: number): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(
      interviewId,
      {
        status: 'completed',
        feedback,
        rating,
      },
      { new: true }
    );
  },

  async cancelInterview(interviewId: string): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(interviewId, { status: 'cancelled' }, { new: true });
  },

  async deleteInterview(interviewId: string): Promise<void> {
    await Interview.findByIdAndDelete(interviewId);
  },
};

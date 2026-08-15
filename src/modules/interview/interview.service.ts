import { InterviewInput } from '@/lib/validations';
import Interview, { IInterview } from '@/models/Interview';

export const interviewService = {
  async createInterview(
    input: InterviewInput
  ): Promise<IInterview> {
    const existingInterview = await Interview.findOne({
      applicationId: input.applicationId,
    });

    if (existingInterview) {
      throw new Error(
        'Interview already scheduled for this application'
      );
    }

    return Interview.create(input);
  },

  async getInterviewById(
    interviewId: string
  ): Promise<IInterview | null> {
    return Interview.findById(interviewId)
      .populate('applicationId');
  },

  async getInterviewByApplicationId(
    applicationId: string
  ): Promise<IInterview | null> {
    return Interview.findOne({ applicationId })
      .populate('applicationId');
  },

  async getInterviewsByApplicationIds(
    applicationIds: string[]
  ): Promise<IInterview[]> {
    if (applicationIds.length === 0) {
      return [];
    }

    return Interview.find({
      applicationId: {
        $in: applicationIds,
      },
    })
      .populate({
        path: 'applicationId',
        populate: [
          {
            path: 'studentId',
          },
          {
            path: 'internshipId',
            populate: [
              {
                path: 'companyId',
              },
              {
                path: 'recruiterId',
              },
            ],
          },
        ],
      })
      .sort({ scheduledAt: -1 });
  },

  async updateInterview(
    interviewId: string,
    input: Partial<InterviewInput>
  ): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(
      interviewId,
      input,
      {
        new: true,
        runValidators: true,
      }
    ).populate('applicationId');
  },

  async getUpcomingInterviews(
    limit: number = 10
  ): Promise<IInterview[]> {
    return Interview.find({
      status: 'scheduled',
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .populate('applicationId')
      .sort({ scheduledAt: 1 })
      .limit(limit);
  },

  async getUpcomingInterviewsForRecruiter(
    recruiterId: string,
    limit: number = 10
  ): Promise<IInterview[]> {
    return this.getInterviewsForRecruiter(
      recruiterId,
      {
        limit,
        status: 'scheduled',
      }
    );
  },

  async getInterviewsForRecruiter(
    recruiterId: string,
    options: {
      limit?: number;
      status?:
        | 'scheduled'
        | 'completed'
        | 'cancelled'
        | 'all';
    } = {}
  ): Promise<IInterview[]> {
    const query: Record<string, unknown> = {};

    if (
      options.status &&
      options.status !== 'all'
    ) {
      query.status = options.status;
    }

    if (
      !options.status ||
      options.status === 'scheduled'
    ) {
      query.scheduledAt = {
        $gte: new Date(),
      };
    }

    const interviews = await Interview.find(query)
      .populate({
        path: 'applicationId',
        populate: {
          path: 'internshipId',
          populate: {
            path: 'companyId',
          },
        },
      })
      .sort({
        scheduledAt:
          options.status === 'completed'
            ? -1
            : 1,
      })
      .limit(options.limit ?? 10);

    return interviews.filter((interview) => {
      const application = interview.applicationId as {
        internshipId?: {
          recruiterId?: {
            toString(): string;
          };
        };
      };

      return (
        application?.internshipId?.recruiterId?.toString() ===
        recruiterId
      );
    });
  },

  async getUpcomingInterviewsForRecruiterLegacy(
    recruiterId: string,
    limit: number = 10
  ): Promise<IInterview[]> {
    const interviews = await Interview.find({
      status: 'scheduled',
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .populate({
        path: 'applicationId',
        populate: {
          path: 'internshipId',
          populate: {
            path: 'companyId',
          },
        },
      })
      .sort({
        scheduledAt: 1,
      })
      .limit(limit);

    return interviews.filter((interview) => {
      const application = interview.applicationId as {
        internshipId?: {
          recruiterId?: {
            toString(): string;
          };
        };
      };

      return (
        application?.internshipId?.recruiterId?.toString() ===
        recruiterId
      );
    });
  },

  async completeInterview(
    interviewId: string,
    feedback: string,
    rating: number
  ): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(
      interviewId,
      {
        status: 'completed',
        feedback,
        rating,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async cancelInterview(
    interviewId: string
  ): Promise<IInterview | null> {
    return Interview.findByIdAndUpdate(
      interviewId,
      {
        status: 'cancelled',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async deleteInterview(
    interviewId: string
  ): Promise<void> {
    await Interview.findByIdAndDelete(
      interviewId
    );
  },
};
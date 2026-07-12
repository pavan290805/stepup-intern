import { RecruiterProfileInput } from '@/lib/validations';
import RecruiterProfile, { IRecruiterProfile } from '@/models/RecruiterProfile';

export const recruiterService = {
  async createProfile(userId: string, input: RecruiterProfileInput): Promise<IRecruiterProfile> {
    const existingProfile = await RecruiterProfile.findOne({ userId });
    if (existingProfile) {
      throw new Error('Recruiter profile already exists');
    }

    return RecruiterProfile.create({
      userId,
      ...input,
    });
  },

  async getProfile(userId: string): Promise<IRecruiterProfile | null> {
    return RecruiterProfile.findOne({ userId })
      .populate('userId', 'name email profilePicture')
      .populate('companyId');
  },

  async updateProfile(userId: string, input: Partial<RecruiterProfileInput>): Promise<IRecruiterProfile | null> {
    return RecruiterProfile.findOneAndUpdate({ userId }, input, { new: true })
      .populate('userId', 'name email profilePicture')
      .populate('companyId');
  },

  async getRecruiterByUserId(userId: string): Promise<IRecruiterProfile | null> {
    return RecruiterProfile.findOne({ userId }).populate('companyId');
  },

  async getRecruitersByCompanyId(companyId: string): Promise<IRecruiterProfile[]> {
    return RecruiterProfile.find({ companyId }).populate('userId', 'name email');
  },

  async verifyRecruiter(recruiterId: string): Promise<IRecruiterProfile | null> {
    return RecruiterProfile.findByIdAndUpdate(
      recruiterId,
      { verificationStatus: 'verified' },
      { new: true }
    );
  },

  async getPendingRecruiters(): Promise<IRecruiterProfile[]> {
    return RecruiterProfile.find({ verificationStatus: 'pending' }).populate('companyId');
  },
};

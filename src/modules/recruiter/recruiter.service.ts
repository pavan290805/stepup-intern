import { RecruiterProfileInput } from '@/lib/validations';
import RecruiterProfile, { IRecruiterProfile } from '@/models/RecruiterProfile';
import "@/models/User";
import "@/models/Company";

export const recruiterService = {
  async createProfile(
    userId: string,
    input: RecruiterProfileInput
  ): Promise<IRecruiterProfile> {
    const existingProfile = await RecruiterProfile.findOne({ userId });

    if (existingProfile) {
      throw new Error("Recruiter profile already exists");
    }

    return RecruiterProfile.create({
      userId,
      ...input,
    });
  },

  async getProfile(userId: string) {
    return RecruiterProfile.findOne({ userId })
      .populate("userId", "name email profilePicture")
      .populate("companyId")
      .lean();
  },

  async updateProfile(
    userId: string,
    input: Partial<RecruiterProfileInput>
  ) {
    return RecruiterProfile.findOneAndUpdate(
      { userId },
      input,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId", "name email profilePicture")
      .populate("companyId");
  },

  async getRecruiterByUserId(userId: string) {
    return RecruiterProfile.findOne({ userId })
      .populate("companyId")
      .lean();
  },

  async getRecruitersByCompanyId(companyId: string) {
    return RecruiterProfile.find({ companyId })
      .populate("userId", "name email")
      .lean();
  },

  async verifyRecruiter(
    recruiterId: string
  ): Promise<IRecruiterProfile | null> {
    return RecruiterProfile.findByIdAndUpdate(
      recruiterId,
      {
        verificationStatus: "verified",
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async getPendingRecruiters() {
    return RecruiterProfile.find({
      verificationStatus: "pending",
    })
      .populate("companyId")
      .lean();
  },
};
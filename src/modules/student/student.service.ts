import { StudentProfileInput } from '@/lib/validations';
import StudentProfile, { IStudentProfile } from '@/models/StudentProfile';

export const studentService = {
  async createProfile(userId: string, input: StudentProfileInput): Promise<IStudentProfile> {
    const existingProfile = await StudentProfile.findOne({ userId });
    if (existingProfile) {
      throw new Error('Student profile already exists');
    }

    return StudentProfile.create({
      userId,
      ...input,
      profileCompletion: calculateProfileCompletion(input),
    });
  },

  async getProfile(userId: string): Promise<IStudentProfile | null> {
    return StudentProfile.findOne({ userId }).populate('userId', 'email name profilePicture');
  },

  async updateProfile(userId: string, input: Partial<StudentProfileInput>): Promise<IStudentProfile | null> {
    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    Object.assign(profile, input);
    profile.profileCompletion = calculateProfileCompletion(profile.toObject() as any);
    await profile.save();

    return profile;
  },

  async getStudentById(studentId: string): Promise<IStudentProfile | null> {
    return StudentProfile.findById(studentId).populate('userId', 'name email profilePicture');
  },

  async getStudentByUserId(userId: string): Promise<IStudentProfile | null> {
    return StudentProfile.findOne({ userId });
  },
};

function calculateProfileCompletion(data: any): number {
  let completedFields = 0;
  const totalFields = 7;

  if (data.headline) completedFields++;
  if (data.bio) completedFields++;
  if (data.resumeUrl) completedFields++;
  if (data.skills && data.skills.length > 0) completedFields++;
  if (data.education && data.education.length > 0) completedFields++;
  if (data.experience && data.experience.length > 0) completedFields++;
  if (data.linkedinUrl || data.githubUrl || data.portfolioUrl) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
}

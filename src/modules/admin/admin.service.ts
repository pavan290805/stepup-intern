import Application from '@/models/Application';
import Company from '@/models/Company';
import Internship from '@/models/Internship';
import RecruiterProfile from '@/models/RecruiterProfile';
import User from '@/models/User';
import { PaginationQuery } from '@/types';

export const adminService = {
  async getAllUsers(query: PaginationQuery): Promise<{
    users: unknown[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: {
      $or?: {
        name?: object;
        email?: object;
      }[];
    } = {};

    if (query.search) {
      filter.$or = [
        {
          name: {
            $regex: query.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: query.search,
            $options: 'i',
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      User.countDocuments(filter),
    ]);

    return {
      users,
      total,
    };
  },

  async getUserById(
    userId: string
  ): Promise<unknown> {
    return User.findById(userId).lean();
  },

  async updateUserStatus(
    userId: string,
    isActive: boolean
  ): Promise<unknown> {
    return User.findByIdAndUpdate(
      userId,
      { isActive },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async deleteUser(
    userId: string
  ): Promise<void> {
    await User.findByIdAndDelete(userId);
  },

  async getPendingCompanies(
    query: PaginationQuery
  ): Promise<{
    companies: unknown[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: {
      verificationStatus: 'pending';
    } = {
      verificationStatus: 'pending',
    };

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      Company.countDocuments(filter),
    ]);

    return {
      companies,
      total,
    };
  },

  async verifyCompany(
    companyId: string
  ): Promise<unknown> {
    return Company.findByIdAndUpdate(
      companyId,
      {
        verificationStatus: 'verified',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async rejectCompany(
    companyId: string
  ): Promise<unknown> {
    return Company.findByIdAndUpdate(
      companyId,
      {
        verificationStatus: 'rejected',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async getPendingRecruiters(
    query: PaginationQuery
  ): Promise<{
    recruiters: unknown[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

const filter: {
  verificationStatus: 'pending';
} = {
  verificationStatus: 'pending',
};

    const [recruiters, total] = await Promise.all([
      RecruiterProfile.find(filter)
        .populate('userId')
        .populate('companyId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      RecruiterProfile.countDocuments(filter),
    ]);

    return {
      recruiters,
      total,
    };
  },

  async verifyRecruiter(
    recruiterId: string
  ): Promise<unknown> {
    return RecruiterProfile.findByIdAndUpdate(
      recruiterId,
      {
        verificationStatus: 'verified',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async rejectRecruiter(
    recruiterId: string
  ): Promise<unknown> {
    return RecruiterProfile.findByIdAndUpdate(
      recruiterId,
      {
        verificationStatus: 'rejected',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async getInternships(
    query: PaginationQuery
  ): Promise<{
    internships: unknown[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [internships, total] = await Promise.all([
      Internship.find()
        .populate('companyId')
        .populate('recruiterId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      Internship.countDocuments(),
    ]);

    return {
      internships,
      total,
    };
  },

  async updateInternshipStatus(
    internshipId: string,
    status: string
  ): Promise<unknown> {
    return Internship.findByIdAndUpdate(
      internshipId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  async removeInternship(
    internshipId: string
  ): Promise<void> {
    await Internship.findByIdAndDelete(
      internshipId
    );
  },

  async getStatistics(): Promise<{
    totalUsers: number;
    totalCompanies: number;
    totalInternships: number;
    totalApplications: number;
    studentCount: number;
    recruiterCount: number;
  }> {
    const [
      totalUsers,
      totalCompanies,
      totalInternships,
      totalApplications,
      studentCount,
      recruiterCount,
    ] = await Promise.all([
      User.countDocuments(),
      Company.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({
        role: 'student',
      }),
      User.countDocuments({
        role: 'recruiter',
      }),
    ]);

    return {
      totalUsers,
      totalCompanies,
      totalInternships,
      totalApplications,
      studentCount,
      recruiterCount,
    };
  },
};
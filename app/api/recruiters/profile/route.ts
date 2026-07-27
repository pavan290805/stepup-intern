import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { recruiterProfileSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import User from '@/models/User';
import { NextRequest } from 'next/server';

type AuthenticatedRequest = NextRequest & {
  user: {
    userId: string;
    role: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const { valid, data, response } = await validateRequestBody(
      request,
      recruiterProfileSchema
    );
    if (!valid) return response;

    const profile = await recruiterService.createProfile(user.userId, data);

    return successResponse(profile, 'Recruiter profile created successfully', 201);
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to create profile',
      undefined,
      400
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const profile = await recruiterService.getProfile(user.userId);

    if (!profile) {
      const dbUser = await User.findById(user.userId).select(
        'name email profilePicture createdAt updatedAt'
      );

      const fallbackProfile = {
        userId: dbUser
          ? {
              name: dbUser.name,
              email: dbUser.email,
              profilePicture: dbUser.profilePicture,
            }
          : undefined,
        companyId: undefined,
        designation: undefined,
        phoneNumber: undefined,
        verificationStatus: undefined,
        createdAt: dbUser?.createdAt,
        updatedAt: dbUser?.updatedAt,
      };

      return successResponse(fallbackProfile);
    }

    return successResponse(profile);
  } catch (error: unknown) {
    console.error('PROFILE ERROR:', error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to get profile',
      undefined,
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const { valid, data, response } = await validateRequestBody(
      request,
      recruiterProfileSchema.partial()
    );
    if (!valid) return response;

    const profile = await recruiterService.updateProfile(user.userId, data);

    return successResponse(profile, 'Recruiter profile updated successfully');
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to update profile',
      undefined,
      400
    );
  }
}
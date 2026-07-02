import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { studentProfileSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { studentService } from '@/modules/student/student.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, studentProfileSchema);
    if (!valid) return response;

    const profile = await studentService.createProfile(user.userId, data as any);

    return successResponse(profile, 'Student profile created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create profile', undefined, 400);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const profile = await studentService.getProfile(user.userId);

    if (!profile) {
      return errorResponse('Student profile not found', undefined, 404);
    }

    return successResponse(profile);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to get profile', undefined, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, studentProfileSchema.partial());
    if (!valid) return response;

    const profile = await studentService.updateProfile(user.userId, data as any);

    return successResponse(profile, 'Student profile updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update profile', undefined, 400);
  }
}

import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { interviewUpdateSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { interviewService } from '@/modules/interview/interview.service';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request);
    if (authError) return authError;

    const interview = await interviewService.getInterviewById(id);

    if (!interview) {
      return errorResponse('Interview not found', undefined, 404);
    }

    return successResponse(interview);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch interview', undefined, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { valid, data, response } = await validateRequestBody(request, interviewUpdateSchema);
    if (!valid) return response;

    const interview = await interviewService.updateInterview(id, data);

    if (!interview) {
      return errorResponse('Interview not found', undefined, 404);
    }

    return successResponse(interview, 'Interview updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update interview', undefined, 400);
  }
}

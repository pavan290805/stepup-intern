import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { internshipSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const internship = await internshipService.getInternshipById(params.id);

    if (!internship) {
      return errorResponse('Internship not found', undefined, 404);
    }

    return successResponse(internship);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch internship', undefined, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, internshipSchema.partial());
    if (!valid) return response;

    // Verify ownership if recruiter
    if (user.role === USER_ROLES.RECRUITER) {
      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      const internship = await internshipService.getInternshipById(params.id);

      if (internship && internship.recruiterId.toString() !== recruiterProfile?._id.toString()) {
        return errorResponse('Not authorized to update this internship', undefined, 403);
      }
    }

    const internship = await internshipService.updateInternship(params.id, data as any);

    if (!internship) {
      return errorResponse('Internship not found', undefined, 404);
    }

    return successResponse(internship, 'Internship updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update internship', undefined, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;

    // Verify ownership if recruiter
    if (user.role === USER_ROLES.RECRUITER) {
      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      const internship = await internshipService.getInternshipById(params.id);

      if (internship && internship.recruiterId.toString() !== recruiterProfile?._id.toString()) {
        return errorResponse('Not authorized to delete this internship', undefined, 403);
      }
    }

    await internshipService.deleteInternship(params.id);

    return successResponse(null, 'Internship deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete internship', undefined, 500);
  }
}

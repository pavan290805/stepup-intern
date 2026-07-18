import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { applicationService } from '@/modules/application/application.service';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;
    const internship = await internshipService.getInternshipById(id);

    if (!internship) {
      return errorResponse('Internship not found', undefined, 404);
    }

    if (user.role === USER_ROLES.RECRUITER) {
      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      if (!recruiterProfile || internship.recruiterId?.toString() !== recruiterProfile._id.toString()) {
        return errorResponse('Not authorized to view these applications', undefined, 403);
      }
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await applicationService.getApplicationsByInternshipId(id, { page, limit });

    return successResponse({
      applications: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch internship applications', undefined, 500);
  }
}

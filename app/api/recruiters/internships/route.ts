import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;
    const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);

    if (!recruiterProfile) {
      return errorResponse('Recruiter profile not found', undefined, 404);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await internshipService.getInternshipsByRecruiterId(recruiterProfile._id.toString(), {
      page,
      limit,
    });

    return successResponse({
      internships: result.internships,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch recruiter internships', undefined, 500);
  }
}

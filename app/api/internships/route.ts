import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { internshipFilterSchema, internshipSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateQueryParams, validateRequestBody } from '@/middleware/validation';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, internshipSchema);
    if (!valid) return response;

    const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
    if (!recruiterProfile) {
      return errorResponse('Recruiter profile not found', undefined, 404);
    }

    const internship = await internshipService.createInternship(recruiterProfile._id.toString(), {
      ...(data as any),
      companyId: recruiterProfile.companyId,
    });

    return successResponse(internship, 'Internship created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create internship', undefined, 400);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { valid, data, response } = validateQueryParams(query, internshipFilterSchema);
    if (!valid) return response;

    const result = await internshipService.getInternships(data as any);

    return successResponse({
      internships: result.internships,
      pagination: {
        total: result.total,
        page: data.page,
        limit: data.limit,
        pages: Math.ceil(result.total / data.limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch internships', undefined, 500);
  }
}

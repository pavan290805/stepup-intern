import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { internshipFilterSchema, internshipSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateQueryParams, validateRequestBody } from '@/middleware/validation';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import Company from '@/models/Company';
import User from '@/models/User';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    try {
      const rawBody = await request.clone().text();
      // eslint-disable-next-line no-console
      console.log('[DEBUG] /api/internships POST raw body:', rawBody);
    } catch (e) {
      // ignore
    }

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, internshipSchema);
    if (!valid) return response;

    let recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);

    if (!recruiterProfile) {
      // Try to auto-create a minimal company and recruiter profile so recruiters
      // created before this feature can still post internships.
      try {
        const dbUser = await User.findById(user.userId).select('name email');
        const company = await Company.create({
          name: dbUser ? `${dbUser.name}'s Company` : 'Unknown Company',
          industry: 'Unknown',
          website: 'https://example.com',
          description: 'Auto-created placeholder company for recruiter',
          companySize: '1-50',
          headquarters: 'Unknown',
        });

        await recruiterService.createProfile(user.userId, {
          companyId: company._id.toString(),
          designation: 'Recruiter',
          phoneNumber: '+10000000000',
        });

        recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      } catch (err) {
        // log but do not expose internals
        // eslint-disable-next-line no-console
        console.warn('Failed to auto-create recruiter profile:', err?.message || err);
      }
    }

    if (!recruiterProfile) {
      return errorResponse('Recruiter profile not found', undefined, 404);
    }

    const internship = await internshipService.createInternship(recruiterProfile._id.toString(), {
      ...(data as any),
      companyId: recruiterProfile.companyId,
      // Publish immediately so newly created internships appear in listings
      status: 'active',
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

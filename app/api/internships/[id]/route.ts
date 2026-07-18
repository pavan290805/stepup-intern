import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { internshipSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { internshipService } from '@/modules/internship/internship.service';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
import RecruiterProfile from '@/models/RecruiterProfile';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const internship = await internshipService.getInternshipById(id);

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
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;

    // debug: log current user
    // eslint-disable-next-line no-console
    console.log('[DEBUG] DELETE /api/internships/:id current user:', { userId: user?.userId, role: user?.role });

    // debug: log current user
    // eslint-disable-next-line no-console
    console.log('[DEBUG] PATCH /api/internships/:id current user:', { userId: user?.userId, role: user?.role });

    const { valid, data, response } = await validateRequestBody(request, internshipSchema.partial());
    if (!valid) return response;

    // Verify ownership if recruiter
    if (user.role === USER_ROLES.RECRUITER) {
      const internship = await internshipService.getInternshipById(id);
      // normalize recruiter id (can be populated object or ObjectId)
      const internshipRecruiterId = internship
        ? (typeof internship.recruiterId === 'object' && internship.recruiterId?._id
            ? internship.recruiterId._id.toString()
            : internship.recruiterId?.toString())
        : null;
      // eslint-disable-next-line no-console
      console.log('[DEBUG] PATCH /api/internships/:id fetched internship:', internship ? { id: internship._id?.toString(), recruiterId: internshipRecruiterId } : null);

      // First try the recruiter's profile lookup
      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      // eslint-disable-next-line no-console
      console.log('[DEBUG] PATCH /api/internships/:id recruiterProfile:', recruiterProfile ? { id: recruiterProfile._id?.toString(), userId: recruiterProfile.userId?.toString() } : null);

      if (recruiterProfile) {
        if (internship && internshipRecruiterId !== recruiterProfile._id.toString()) {
          // eslint-disable-next-line no-console
          console.warn('[DEBUG] PATCH ownership mismatch', { internshipRecruiterId, recruiterProfileId: recruiterProfile._id?.toString(), currentUserId: user.userId });
          return errorResponse('Not authorized to update this internship', undefined, 403);
        }
      } else {
        // Fallback: if recruiter profile is missing for the current user, resolve the internship's
        // recruiter profile and compare its userId to the current user.
        if (internship) {
          const ownerProfile = await RecruiterProfile.findById(internship.recruiterId).select('userId');
          // eslint-disable-next-line no-console
          console.log('[DEBUG] PATCH ownerProfile (fallback):', ownerProfile ? { id: ownerProfile._id?.toString(), userId: ownerProfile.userId?.toString() } : null);
          if (ownerProfile && ownerProfile.userId?.toString() !== user.userId) {
            // eslint-disable-next-line no-console
            console.warn('[DEBUG] PATCH fallback ownership mismatch', { ownerUserId: ownerProfile.userId?.toString(), currentUserId: user.userId });
            return errorResponse('Not authorized to update this internship', undefined, 403);
          }
        }
      }
    }

    const internship = await internshipService.updateInternship(id, data as any);

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
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;

    // Verify ownership if recruiter
    if (user.role === USER_ROLES.RECRUITER) {
      const internship = await internshipService.getInternshipById(id);
      // normalize recruiter id (can be populated object or ObjectId)
      const internshipRecruiterIdDel = internship
        ? (typeof internship.recruiterId === 'object' && internship.recruiterId?._id
            ? internship.recruiterId._id.toString()
            : internship.recruiterId?.toString())
        : null;
      // eslint-disable-next-line no-console
      console.log('[DEBUG] DELETE /api/internships/:id fetched internship:', internship ? { id: internship._id?.toString(), recruiterId: internshipRecruiterIdDel } : null);

      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);
      // eslint-disable-next-line no-console
      console.log('[DEBUG] DELETE /api/internships/:id recruiterProfile:', recruiterProfile ? { id: recruiterProfile._id?.toString(), userId: recruiterProfile.userId?.toString() } : null);

      if (recruiterProfile) {
        if (internship && internshipRecruiterIdDel !== recruiterProfile._id.toString()) {
          // eslint-disable-next-line no-console
          console.warn('[DEBUG] DELETE ownership mismatch', { internshipRecruiterId: internshipRecruiterIdDel, recruiterProfileId: recruiterProfile._id?.toString(), currentUserId: user.userId });
          return errorResponse('Not authorized to delete this internship', undefined, 403);
        }
      } else {
        if (internship) {
          const ownerProfile = await RecruiterProfile.findById(internship.recruiterId).select('userId');
          // eslint-disable-next-line no-console
          console.log('[DEBUG] DELETE ownerProfile (fallback):', ownerProfile ? { id: ownerProfile._id?.toString(), userId: ownerProfile.userId?.toString() } : null);
          if (ownerProfile && ownerProfile.userId?.toString() !== user.userId) {
            // eslint-disable-next-line no-console
            console.warn('[DEBUG] DELETE fallback ownership mismatch', { ownerUserId: ownerProfile.userId?.toString(), currentUserId: user.userId });
            return errorResponse('Not authorized to delete this internship', undefined, 403);
          }
        }
      }
    }

    await internshipService.deleteInternship(id);

    return successResponse(null, 'Internship deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete internship', undefined, 500);
  }
}

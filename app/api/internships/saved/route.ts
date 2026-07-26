import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { studentService } from '@/modules/student/student.service';
import { savedInternshipService } from '@/modules/user/saved-internship.service';
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

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const body = await request.json();
    const { internshipId } = body;

    if (!internshipId) {
      return errorResponse(
        'Internship ID is required',
        undefined,
        400
      );
    }

    const studentProfile = await studentService.getStudentByUserId(
      user.userId
    );

    if (!studentProfile) {
      return errorResponse(
        'Student profile not found',
        undefined,
        404
      );
    }

    const saved = await savedInternshipService.saveInternship(
      studentProfile._id.toString(),
      internshipId
    );

    return successResponse(
      saved,
      'Internship saved successfully',
      201
    );
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to save internship',
      undefined,
      400
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const studentProfile = await studentService.getStudentByUserId(
      user.userId
    );

    if (!studentProfile) {
      return errorResponse(
        'Student profile not found',
        undefined,
        404
      );
    }

    const result = await savedInternshipService.getSavedInternships(
      studentProfile._id.toString(),
      { page, limit }
    );

    return successResponse({
      internships: result.internships,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to fetch saved internships',
      undefined,
      500
    );
  }
}
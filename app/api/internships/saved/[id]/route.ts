import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { studentService } from '@/modules/student/student.service';
import { savedInternshipService } from '@/modules/user/saved-internship.service';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const studentProfile = await studentService.getStudentByUserId(user.userId);
    if (!studentProfile) {
      return errorResponse('Student profile not found', undefined, 404);
    }

    await savedInternshipService.removeSavedInternship(studentProfile._id.toString(), params.id);

    return successResponse(null, 'Internship removed from saved list');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to remove saved internship', undefined, 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const studentProfile = await studentService.getStudentByUserId(user.userId);
    if (!studentProfile) {
      return errorResponse('Student profile not found', undefined, 404);
    }

    const isSaved = await savedInternshipService.isSaved(studentProfile._id.toString(), params.id);

    return successResponse({ isSaved });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to check saved status', undefined, 500);
  }
}

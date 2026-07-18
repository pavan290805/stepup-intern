import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { adminService } from '@/modules/admin/admin.service';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.ADMIN]);
    if (authError) return authError;

    const body = await request.json();

    if (!body.action) {
      return errorResponse('Action (verify/reject) is required', undefined, 400);
    }

    let recruiter;

    if (body.action === 'verify') {
      recruiter = await adminService.verifyRecruiter(id);
    } else if (body.action === 'reject') {
      recruiter = await adminService.rejectRecruiter(id);
    } else {
      return errorResponse('Invalid action', undefined, 400);
    }

    if (!recruiter) {
      return errorResponse('Recruiter not found', undefined, 404);
    }

    return successResponse(recruiter, `Recruiter ${body.action}ied successfully`);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update recruiter', undefined, 400);
  }
}

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

    if (!body.status) {
      return errorResponse('Status field is required', undefined, 400);
    }

    const internship = await adminService.updateInternshipStatus(id, body.status);

    if (!internship) {
      return errorResponse('Internship not found', undefined, 404);
    }

    return successResponse(internship, 'Internship status updated successfully');
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

    const authError = await withAuth(request, [USER_ROLES.ADMIN]);
    if (authError) return authError;

    await adminService.removeInternship(id);

    return successResponse(null, 'Internship deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete internship', undefined, 500);
  }
}

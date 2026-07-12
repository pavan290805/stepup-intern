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

    if (body.isActive === undefined) {
      return errorResponse('isActive field is required', undefined, 400);
    }

    const user = await adminService.updateUserStatus(id, body.isActive);

    if (!user) {
      return errorResponse('User not found', undefined, 404);
    }

    return successResponse(user, 'User status updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update user', undefined, 400);
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

    await adminService.deleteUser(id);

    return successResponse(null, 'User deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete user', undefined, 500);
  }
}

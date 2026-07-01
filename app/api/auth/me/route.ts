import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { authService } from '@/modules/auth/auth.service';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request);
    if (authError) return authError;

    const user = (request as any).user;

    const currentUser = await authService.getCurrentUser(user.userId);

    if (!currentUser) {
      return errorResponse('User not found', undefined, 404);
    }

    return successResponse({
      id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      profilePicture: currentUser.profilePicture,
      isVerified: currentUser.isVerified,
      isActive: currentUser.isActive,
      createdAt: currentUser.createdAt,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to get current user', undefined, 500);
  }
}

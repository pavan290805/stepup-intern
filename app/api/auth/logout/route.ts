import { connectDB } from '@/lib/db';
import { clearAuthCookies, errorResponse, withAuth } from '@/middleware/auth';
import { authService } from '@/modules/auth/auth.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request);
    if (authError) return authError;

    const user = (request as any).user;

    await authService.logout(user.userId);

    return clearAuthCookies();
  } catch (error: any) {
    return errorResponse(error.message || 'Logout failed', undefined, 500);
  }
}

import { connectDB } from '@/lib/db';
import { createAuthCookies, errorResponse } from '@/middleware/auth';
import { authService } from '@/modules/auth/auth.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const refreshToken =
      request.cookies.get('refreshToken')?.value ||
      (await request.json()).refreshToken;

    if (!refreshToken) {
      return errorResponse('Refresh token required', undefined, 401);
    }

    const result = await authService.refreshToken(refreshToken);

    return createAuthCookies(
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      result.accessToken,
      result.refreshToken,
      'Token refreshed'
    );
  } catch (error: any) {
    return errorResponse(error.message || 'Token refresh failed', undefined, 401);
  }
}

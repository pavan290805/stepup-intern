import { connectDB } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { createAuthCookies, errorResponse } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { authService } from '@/modules/auth/auth.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { valid, data, response } = await validateRequestBody(request, registerSchema);

    if (!valid) {
      return response;
    }

    const result = await authService.register(data as any);

    return createAuthCookies(
      {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      result.accessToken,
      result.refreshToken,
      'User registered successfully'
    );
  } catch (error: any) {
    return errorResponse(error.message || 'Registration failed', undefined, 400);
  }
}

import { verifyAccessToken } from '@/lib/auth';
import { ApiResponse, JwtPayload } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthRequest extends NextRequest {
  user?: JwtPayload;
}

export async function withAuth(request: NextRequest, requiredRoles?: string[]) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No token provided' },
      { status: 401 }
    );
  }

  console.log("Token:", token);

const decoded = verifyAccessToken(token);

console.log("Decoded:", decoded);

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  if (requiredRoles && !requiredRoles.includes(decoded.role)) {
    return NextResponse.json(
      { success: false, message: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  (request as AuthRequest).user = decoded;
  return null;
}

export function successResponse<T>(data: T, message: string = 'Success', status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    { status }
  );
}

export function errorResponse(message: string, errors?: string[], status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    } as ApiResponse,
    { status }
  );
}

export function createAuthCookies<T>(
  data: T,
  accessToken: string,
  refreshToken: string,
  message: string = 'Authenticated successfully',
  status: number = 200
) {
  const response = NextResponse.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    { status }
  );

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}

export function clearAuthCookies() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}

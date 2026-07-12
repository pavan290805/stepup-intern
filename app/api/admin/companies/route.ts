import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { adminService } from '@/modules/admin/admin.service';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await adminService.getPendingCompanies({ page, limit });

    return successResponse({
      companies: result.companies,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch companies', undefined, 500);
  }
}

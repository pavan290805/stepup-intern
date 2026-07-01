import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { companySchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { companyService } from '@/modules/company/company.service';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const company = await companyService.getCompanyById(id);

    if (!company) {
      return errorResponse('Company not found', undefined, 404);
    }

    return successResponse(company);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch company', undefined, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { valid, data, response } = await validateRequestBody(request, companySchema.partial());
    if (!valid) return response;

    const company = await companyService.updateCompany(id, data as any);

    if (!company) {
      return errorResponse('Company not found', undefined, 404);
    }

    return successResponse(company, 'Company updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update company', undefined, 400);
  }
}

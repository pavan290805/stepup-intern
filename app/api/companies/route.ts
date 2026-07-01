import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { companySchema, paginationSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateQueryParams, validateRequestBody } from '@/middleware/validation';
import { companyService } from '@/modules/company/company.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { valid, data, response } = await validateRequestBody(request, companySchema);
    if (!valid) return response;

    const company = await companyService.createCompany(data as any);

    return successResponse(company, 'Company created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create company', undefined, 400);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);

    const { valid, data, response } = validateQueryParams(query, paginationSchema);
    if (!valid) return response;

    const result = await companyService.getCompanies(data as any);

    return successResponse({
      companies: result.companies,
      pagination: {
        total: result.total,
        page: data.page,
        limit: data.limit,
        pages: Math.ceil(result.total / data.limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch companies', undefined, 500);
  }
}

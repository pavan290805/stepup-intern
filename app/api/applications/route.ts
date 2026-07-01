import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { applicationSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { applicationService } from '@/modules/application/application.service';
import { notificationService } from '@/modules/notification/notification.service';
import { studentService } from '@/modules/student/student.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const { valid, data, response } = await validateRequestBody(request, applicationSchema);
    if (!valid) return response;

    const studentProfile = await studentService.getStudentByUserId(user.userId);
    if (!studentProfile) {
      return errorResponse('Student profile not found', undefined, 404);
    }

    const application = await applicationService.createApplication(studentProfile._id.toString(), data as any);

    // Create notification
    await notificationService.createNotification(user.userId, {
      title: 'Application Submitted',
      message: 'Your internship application has been submitted successfully',
      type: 'application_received',
      relatedId: application._id.toString(),
    });

    return successResponse(application, 'Application submitted successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to submit application', undefined, 400);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const user = (request as any).user;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const studentProfile = await studentService.getStudentByUserId(user.userId);
    if (!studentProfile) {
      return errorResponse('Student profile not found', undefined, 404);
    }

    const result = await applicationService.getMyApplications(studentProfile._id.toString(), { page, limit });

    return successResponse({
      applications: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch applications', undefined, 500);
  }
}

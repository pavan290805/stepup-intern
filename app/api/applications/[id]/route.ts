import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { applicationStatusUpdateSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import StudentProfile from '@/models/StudentProfile';
import User from '@/models/User';
import { applicationService } from '@/modules/application/application.service';
import { notificationService } from '@/modules/notification/notification.service';
import { RouteParams } from '@/types';
import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { valid, data, response } = await validateRequestBody(request, applicationStatusUpdateSchema);
    if (!valid) return response;

    const application = await applicationService.updateApplicationStatus(id, data as any);

    if (!application) {
      return errorResponse('Application not found', undefined, 404);
    }

    // Create notification for the student who owns this application.
    const studentProfile = await StudentProfile.findById(application.studentId);
    if (studentProfile?.userId) {
      const studentUser = await User.findById(studentProfile.userId);
      if (studentUser) {
        await notificationService.createNotification(studentUser._id.toString(), {
          title: 'Application Status Updated',
          message: `Your application status has been updated to: ${data.status}`,
          type: 'application_status',
          relatedId: application._id.toString(),
        });
      }
    }

    return successResponse(application, 'Application status updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update application', undefined, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    await connectDB();
    const { id } = await params;

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    await applicationService.deleteApplication(id);

    return successResponse(null, 'Application deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete application', undefined, 500);
  }
}

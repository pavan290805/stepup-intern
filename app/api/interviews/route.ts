import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { interviewSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import User from '@/models/User';
import { applicationService } from '@/modules/application/application.service';
import { interviewService } from '@/modules/interview/interview.service';
import { notificationService } from '@/modules/notification/notification.service';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const { valid, data, response } = await validateRequestBody(request, interviewSchema);
    if (!valid) return response;

    const interview = await interviewService.createInterview(data as any);

    // Create notification for student
    const application = await applicationService.getApplicationById(data.applicationId);
    if (application?.studentId) {
      const student = await User.findById(application.studentId);
      if (student) {
        await notificationService.createNotification(student._id.toString(), {
          title: 'Interview Scheduled',
          message: 'Your interview has been scheduled',
          type: 'interview_scheduled',
          relatedId: interview._id.toString(),
        });
      }
    }

    return successResponse(interview, 'Interview scheduled successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to schedule interview', undefined, 400);
  }
}

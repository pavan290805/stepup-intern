import { USER_ROLES } from '@/constants';
import { connectDB } from '@/lib/db';
import { interviewSchema } from '@/lib/validations';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { validateRequestBody } from '@/middleware/validation';
import { recruiterService } from '@/modules/recruiter/recruiter.service';
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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER, USER_ROLES.ADMIN]);
    if (authError) return authError;

    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'scheduled' | 'completed' | 'cancelled' | 'all' | null;

    if (user.role === USER_ROLES.RECRUITER) {
      const recruiterProfile = await recruiterService.getRecruiterByUserId(user.userId);

      if (!recruiterProfile) {
        return errorResponse('Recruiter profile not found', undefined, 404);
      }

      const interviews = await interviewService.getInterviewsForRecruiter(recruiterProfile._id.toString(), {
        limit,
        status: status || 'scheduled',
      });

      return successResponse({ interviews });
    }

    const interviews = await interviewService.getUpcomingInterviews(limit);
    return successResponse({ interviews });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch interviews', undefined, 500);
  }
}

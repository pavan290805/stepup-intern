import { MAX_FILE_SIZE, USER_ROLES } from '@/constants';
import { uploadFile } from '@/lib/cloudinary';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.STUDENT]);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', undefined, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('File size exceeds maximum allowed size', undefined, 400);
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only PDF and DOC files are allowed', undefined, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeUrl = await uploadFile(buffer, file.name, 'resumes');

    return successResponse({ resumeUrl }, 'Resume uploaded successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to upload resume', undefined, 500);
  }
}

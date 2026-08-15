import type { NextRequest } from "next/server";
import { studentService } from "@/modules/students/student.service";
import { saveInternshipSchema, upsertStudentProfileSchema } from "@/modules/students/student.validators";
import { analyzeResumeSchema } from "@/ai/ai.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const studentController = {
  async getProfile(request: NextRequest, context: AuthContext) {
    const profile = await studentService.getProfile(context.user.id);
    return ApiResponse.success(profile, "Student profile retrieved");
  },

  async upsertProfile(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = upsertStudentProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid profile payload", parsed.error.flatten());
    }

    const profile = await studentService.upsertProfile(context.user.id, parsed.data);
    return ApiResponse.success(profile, "Student profile saved");
  },

  async uploadResume(request: NextRequest, context: AuthContext) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ValidationError("A resume file must be provided under the 'file' field");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resume = await studentService.uploadResume(context.user.id, buffer, {
      mimeType: file.type,
      sizeBytes: file.size,
      fileName: file.name,
    });

    return ApiResponse.created(resume, "Resume uploaded successfully");
  },

  async listResumes(request: NextRequest, context: AuthContext) {
    const resumes = await studentService.listResumes(context.user.id);
    return ApiResponse.success(resumes, "Resumes retrieved");
  },

  async deleteResume(request: NextRequest, context: AuthContext) {
    const resumeId = context.params?.id;
    if (!resumeId) throw new ValidationError("Resume id is required");

    const result = await studentService.deleteResume(context.user.id, resumeId);
    return ApiResponse.success(result, "Resume deleted");
  },

  async setActiveResume(request: NextRequest, context: AuthContext) {
    const resumeId = context.params?.id;
    if (!resumeId) throw new ValidationError("Resume id is required");

    const result = await studentService.setActiveResume(context.user.id, resumeId);
    return ApiResponse.success(result, "Active resume updated");
  },

  async saveInternship(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = saveInternshipSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await studentService.saveInternship(context.user.id, parsed.data.internshipId);
    return ApiResponse.success(result, "Internship saved");
  },

  async unsaveInternship(request: NextRequest, context: AuthContext) {
    const internshipId = context.params?.id;
    if (!internshipId) throw new ValidationError("Internship id is required");

    const result = await studentService.unsaveInternship(context.user.id, internshipId);
    return ApiResponse.success(result, "Internship removed from saved list");
  },

  async getSavedInternships(request: NextRequest, context: AuthContext) {
    const result = await studentService.getSavedInternships(context.user.id);
    return ApiResponse.success(result, "Saved internships retrieved");
  },

  async dashboard(request: NextRequest, context: AuthContext) {
    const result = await studentService.getDashboard(context.user.id);
    return ApiResponse.success(result, "Student dashboard data retrieved");
  },

  async analytics(request: NextRequest, context: AuthContext) {
    const result = await studentService.getAnalytics(context.user.id);
    return ApiResponse.success(result, "Student analytics retrieved");
  },

  async analyzeResume(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = analyzeResumeSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    const result = await studentService.analyzeResume(
      context.user.id,
      parsed.data.resumeId,
      parsed.data.resumeText,
      parsed.data.targetRole
    );
    return ApiResponse.success(result, "Resume analyzed successfully");
  },
};

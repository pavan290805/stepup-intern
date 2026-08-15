import type { NextRequest } from "next/server";
import { recruiterService } from "@/modules/recruiters/recruiter.service";
import {
  createCompanySchema,
  scheduleInterviewSchema,
  updateApplicationStatusSchema,
  updateCompanySchema,
  upsertRecruiterProfileSchema,
} from "@/modules/recruiters/recruiter.validators";
import { applicationListQuerySchema } from "@/modules/applications/application.validators";
import { generateJdSchema } from "@/ai/ai.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const recruiterController = {
  async getProfile(request: NextRequest, context: AuthContext) {
    const profile = await recruiterService.getProfile(context.user.id);
    return ApiResponse.success(profile, "Recruiter profile retrieved");
  },

  async upsertProfile(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = upsertRecruiterProfileSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid profile payload", parsed.error.flatten());

    const profile = await recruiterService.upsertProfile(context.user.id, parsed.data);
    return ApiResponse.success(profile, "Recruiter profile saved");
  },

  async createCompany(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid company payload", parsed.error.flatten());

    const company = await recruiterService.createCompany(context.user.id, parsed.data);
    return ApiResponse.created(company, "Company profile created");
  },

  async getCompany(request: NextRequest, context: AuthContext) {
    const company = await recruiterService.getOwnCompany(context.user.id);
    return ApiResponse.success(company, "Company profile retrieved");
  },

  async updateCompany(request: NextRequest, context: AuthContext) {
    const company = await recruiterService.getOwnCompany(context.user.id);
    const body = await parseJsonBody(request);
    const parsed = updateCompanySchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid company payload", parsed.error.flatten());

    const updated = await recruiterService.updateCompany(context.user.id, String(company._id), parsed.data);
    return ApiResponse.success(updated, "Company profile updated");
  },

  async getApplicants(request: NextRequest, context: AuthContext) {
    const internshipId = request.nextUrl.searchParams.get("internshipId");
    if (!internshipId) throw new ValidationError("internshipId query parameter is required");

    const query = applicationListQuerySchema.safeParse(parseQuery(request));
    if (!query.success) throw new ValidationError("Invalid query parameters", query.error.flatten());

    const result = await recruiterService.getApplicants(
      context.user.id,
      internshipId,
      query.data.cursor,
      query.data.limit,
      query.data.status
    );
    return ApiResponse.success(result, "Applicants retrieved");
  },

  async updateApplicantStatus(request: NextRequest, context: AuthContext) {
    const applicationId = context.params?.id;
    if (!applicationId) throw new ValidationError("Application id is required");

    const body = await parseJsonBody(request);
    const parsed = updateApplicationStatusSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid status payload", parsed.error.flatten());

    const result = await recruiterService.updateApplicantStatus(context.user.id, applicationId, parsed.data);
    return ApiResponse.success(result, "Application status updated");
  },

  async scheduleInterview(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = scheduleInterviewSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid interview payload", parsed.error.flatten());

    const interview = await recruiterService.scheduleInterview(context.user.id, parsed.data);
    return ApiResponse.created(interview, "Interview scheduled");
  },

  async listInterviews(request: NextRequest, context: AuthContext) {
    const interviews = await recruiterService.listInterviews(context.user.id);
    return ApiResponse.success(interviews, "Interviews retrieved");
  },

  async dashboard(request: NextRequest, context: AuthContext) {
    const dashboard = await recruiterService.getDashboard(context.user.id);
    return ApiResponse.success(dashboard, "Recruiter dashboard data retrieved");
  },

  async analytics(request: NextRequest, context: AuthContext) {
    const analytics = await recruiterService.getAnalytics(context.user.id);
    return ApiResponse.success(analytics, "Recruiter analytics retrieved");
  },

  async generateJobDescription(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = generateJdSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid payload", parsed.error.flatten());

    const result = await recruiterService.generateJobDescription(context.user.id, parsed.data);
    return ApiResponse.success(result, "Job description generated");
  },
};

import { recruiterRepository, companyRepository, interviewRepository } from "@/modules/recruiters/recruiter.repository";
import { applicationService } from "@/modules/applications/application.service";
import { internshipRepository } from "@/modules/internships/internship.repository";
import { jdGeneratorService } from "@/ai/services/jd-generator.service";
import { ConflictError, ForbiddenError, NotFoundError } from "@/shared/errors";
import type {
  CreateCompanyDto,
  ScheduleInterviewDto,
  UpdateApplicationStatusDto,
  UpdateCompanyDto,
  UpsertRecruiterProfileDto,
} from "@/modules/recruiters/recruiter.validators";
import type { GenerateJdDto } from "@/ai/ai.validators";

export const recruiterService = {
  async getProfile(userId: string) {
    const profile = await recruiterRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Recruiter profile not found. Complete your profile first.");
    }
    return profile;
  },

  async upsertProfile(userId: string, data: UpsertRecruiterProfileDto) {
    return recruiterRepository.upsertProfile(userId, data);
  },

  async createCompany(userId: string, data: CreateCompanyDto) {
    const existing = await companyRepository.findByCreator(userId);
    if (existing) {
      throw new ConflictError("You have already registered a company. Use update instead.");
    }

    const company = await companyRepository.create(userId, data);
    await recruiterRepository.attachCompany(userId, String(company._id));
    return company;
  },

  async updateCompany(userId: string, companyId: string, data: UpdateCompanyDto) {
    const company = await companyRepository.findById(companyId);
    if (!company || String(company.createdBy) !== userId) {
      throw new ForbiddenError("You do not have access to this company profile");
    }
    return companyRepository.update(companyId, data);
  },

  async getOwnCompany(userId: string) {
    const company = await companyRepository.findByCreator(userId);
    if (!company) {
      throw new NotFoundError("No company profile found for this recruiter");
    }
    return company;
  },

  async getApplicants(
    recruiterId: string,
    internshipId: string,
    cursor: string | undefined,
    limit: number,
    status?: string
  ) {
    return applicationService.getForInternship(internshipId, recruiterId, cursor, limit, status);
  },

  async updateApplicantStatus(recruiterId: string, applicationId: string, data: UpdateApplicationStatusDto) {
    return applicationService.updateStatus(applicationId, recruiterId, data.status, data.note);
  },

  async scheduleInterview(recruiterId: string, data: ScheduleInterviewDto) {
    const application = await applicationService.getById(data.applicationId);
    if (String(application.recruiterId) !== recruiterId) {
      throw new ForbiddenError("You do not have access to this application");
    }

    const interview = await interviewRepository.create(recruiterId, String(application.studentId), data);
    await applicationService.updateStatus(data.applicationId, recruiterId, "interview", "Interview scheduled");
    return interview;
  },

  async listInterviews(recruiterId: string) {
    return interviewRepository.findByRecruiter(recruiterId);
  },

  async getDashboard(recruiterId: string) {
    const [internships, applicationCount] = await Promise.all([
      internshipRepository.findByRecruiter(recruiterId, undefined, 100),
      applicationService.getForRecruiter(recruiterId, undefined, 1),
    ]);

    const publishedCount = internships.filter((i) => i.status === "published").length;
    const draftCount = internships.filter((i) => i.status === "draft").length;
    const closedCount = internships.filter((i) => i.status === "closed").length;

    return {
      totalInternships: internships.length,
      publishedCount,
      draftCount,
      closedCount,
      totalApplicationsSample: applicationCount.items.length,
    };
  },

  async getAnalytics(recruiterId: string) {
    const internships = await internshipRepository.findByRecruiter(recruiterId, undefined, 200);

    const totalViews = internships.reduce((sum, i) => sum + i.viewCount, 0);
    const totalApplications = internships.reduce((sum, i) => sum + i.applicationCount, 0);
    const conversionRate = totalViews > 0 ? Number((totalApplications / totalViews).toFixed(3)) : 0;

    return {
      totalInternshipsPosted: internships.length,
      totalViews,
      totalApplications,
      viewToApplicationConversionRate: conversionRate,
      averageApplicationsPerInternship:
        internships.length > 0 ? Number((totalApplications / internships.length).toFixed(2)) : 0,
    };
  },

  async generateJobDescription(userId: string, data: GenerateJdDto) {
    const company = await companyRepository.findByCreator(userId);
    if (!company) {
      throw new NotFoundError("Create a company profile before generating a job description");
    }

    return jdGeneratorService.generate({
      roleTitle: data.roleTitle,
      companyName: company.name,
      companyDescription: data.companyDescription ?? company.description ?? undefined,
      skillsRequired: data.skillsRequired,
      location: data.location,
      type: data.type,
    });
  },
};

export type RecruiterService = typeof recruiterService;

import { applicationRepository } from "@/modules/applications/application.repository";
import { internshipRepository } from "@/modules/internships/internship.repository";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import { isPast } from "@/shared/utils/date";
import type { ApplicationStatus } from "@/database/models/application.model";
import type { CreateApplicationDto } from "@/modules/applications/application.validators";

export const applicationService = {
  async apply(studentId: string, resumeOwnerId: string, data: CreateApplicationDto) {
    if (studentId !== resumeOwnerId) {
      throw new ForbiddenError("You can only apply using your own resume");
    }

    const internship = await internshipRepository.findById(data.internshipId);
    if (!internship || internship.status !== "published") {
      throw new NotFoundError("Internship not found or is no longer accepting applications");
    }

    if (internship.applicationDeadline && isPast(internship.applicationDeadline)) {
      throw new ValidationError("The application deadline for this internship has passed");
    }

    const existing = await applicationRepository.findExisting(studentId, data.internshipId);
    if (existing) {
      throw new ConflictError("You have already applied to this internship");
    }

    const application = await applicationRepository.create({
      studentId,
      internshipId: data.internshipId,
      recruiterId: String(internship.recruiterId),
      resumeId: data.resumeId,
      coverNote: data.coverNote,
    });

    await internshipRepository.incrementApplicationCount(data.internshipId, 1);

    return application;
  },

  async withdraw(applicationId: string, studentId: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || String(application.studentId) !== studentId) {
      throw new NotFoundError("Application not found");
    }

    if (application.status === "hired" || application.status === "withdrawn") {
      throw new ValidationError(`Cannot withdraw an application with status "${application.status}"`);
    }

    const updated = await applicationRepository.updateStatus(applicationId, "withdrawn", "Withdrawn by student");
    await internshipRepository.incrementApplicationCount(String(application.internshipId), -1);
    return updated;
  },

  async getHistoryForStudent(studentId: string, cursor: string | undefined, limit: number, status?: string) {
    const results = await applicationRepository.findByStudent(studentId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async getForInternship(
    internshipId: string,
    recruiterId: string,
    cursor: string | undefined,
    limit: number,
    status?: string
  ) {
    const internship = await internshipRepository.findByIdAndRecruiter(internshipId, recruiterId);
    if (!internship) {
      throw new ForbiddenError("You do not have access to applicants for this internship");
    }

    const results = await applicationRepository.findByInternship(internshipId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async getForRecruiter(recruiterId: string, cursor: string | undefined, limit: number, status?: string) {
    const results = await applicationRepository.findByRecruiter(recruiterId, cursor, limit, status);
    return buildPaginatedResult(results, limit);
  },

  async updateStatus(applicationId: string, recruiterId: string, status: ApplicationStatus, note?: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || String(application.recruiterId) !== recruiterId) {
      throw new NotFoundError("Application not found");
    }

    return applicationRepository.updateStatus(applicationId, status, note);
  },

  async getById(applicationId: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    return application;
  },
};

export type ApplicationService = typeof applicationService;

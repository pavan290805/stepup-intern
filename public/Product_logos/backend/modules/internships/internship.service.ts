import { internshipRepository } from "@/modules/internships/internship.repository";
import { companyRepository } from "@/modules/recruiters/recruiter.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type {
  CreateInternshipDto,
  InternshipSearchQuery,
  UpdateInternshipDto,
} from "@/modules/internships/internship.validators";

async function assertOwnership(internshipId: string, recruiterId: string) {
  const internship = await internshipRepository.findByIdAndRecruiter(internshipId, recruiterId);
  if (!internship) {
    throw new ForbiddenError("You do not have access to this internship posting");
  }
  return internship;
}

export const internshipService = {
  async create(recruiterId: string, data: CreateInternshipDto) {
    const company = await companyRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError("Company not found. Create a company profile first.");
    }
    return internshipRepository.create(recruiterId, data);
  },

  async update(internshipId: string, recruiterId: string, data: UpdateInternshipDto) {
    await assertOwnership(internshipId, recruiterId);
    const updated = await internshipRepository.update(internshipId, data);
    if (!updated) {
      throw new NotFoundError("Internship not found");
    }
    return updated;
  },

  async publish(internshipId: string, recruiterId: string) {
    const internship = await assertOwnership(internshipId, recruiterId);

    if (!internship.title || !internship.description || !internship.location) {
      throw new ValidationError("Internship must have a title, description, and location before publishing");
    }

    return internshipRepository.updateStatus(internshipId, "published");
  },

  async close(internshipId: string, recruiterId: string) {
    await assertOwnership(internshipId, recruiterId);
    return internshipRepository.updateStatus(internshipId, "closed");
  },

  async delete(internshipId: string, recruiterId: string) {
    await assertOwnership(internshipId, recruiterId);
    return internshipRepository.delete(internshipId);
  },

  async getById(internshipId: string, incrementView = false) {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship || internship.status === "draft") {
      throw new NotFoundError("Internship not found");
    }

    if (incrementView) {
      await internshipRepository.incrementViewCount(internshipId);
    }

    return internship;
  },

  async getForRecruiter(internshipId: string, recruiterId: string) {
    return assertOwnership(internshipId, recruiterId);
  },

  async search(query: InternshipSearchQuery) {
    const results = await internshipRepository.search(
      { location: query.location, type: query.type, skills: query.skills, textQuery: query.q },
      query.cursor,
      query.limit
    );
    return buildPaginatedResult(results, query.limit);
  },

  async listForRecruiter(recruiterId: string, cursor: string | undefined, limit: number) {
    const results = await internshipRepository.findByRecruiter(recruiterId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },
};

export type InternshipService = typeof internshipService;

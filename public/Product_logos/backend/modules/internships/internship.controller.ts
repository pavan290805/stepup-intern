import type { NextRequest } from "next/server";
import { internshipService } from "@/modules/internships/internship.service";
import {
  createInternshipSchema,
  internshipSearchQuerySchema,
  updateInternshipSchema,
} from "@/modules/internships/internship.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const internshipController = {
  async search(request: NextRequest) {
    const parsed = internshipSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) {
      throw new ValidationError("Invalid search parameters", parsed.error.flatten());
    }

    const result = await internshipService.search(parsed.data);
    return ApiResponse.success(result, "Internships retrieved");
  },

  async getById(request: NextRequest, context: { params?: Record<string, string> }) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    const internship = await internshipService.getById(id, true);
    return ApiResponse.success(internship, "Internship retrieved");
  },

  async create(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createInternshipSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid internship payload", parsed.error.flatten());
    }

    const internship = await internshipService.create(context.user.id, parsed.data);
    return ApiResponse.created(internship, "Internship created as draft");
  },

  async update(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    const body = await parseJsonBody(request);
    const parsed = updateInternshipSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid internship payload", parsed.error.flatten());
    }

    const internship = await internshipService.update(id, context.user.id, parsed.data);
    return ApiResponse.success(internship, "Internship updated");
  },

  async publish(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    const internship = await internshipService.publish(id, context.user.id);
    return ApiResponse.success(internship, "Internship published");
  },

  async close(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    const internship = await internshipService.close(id, context.user.id);
    return ApiResponse.success(internship, "Internship closed");
  },

  async delete(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Internship id is required");

    await internshipService.delete(id, context.user.id);
    return ApiResponse.success(null, "Internship deleted");
  },

  async listOwn(request: NextRequest, context: AuthContext) {
    const parsed = internshipSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.flatten());
    }

    const result = await internshipService.listForRecruiter(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Your internship postings");
  },
};

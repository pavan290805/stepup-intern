import type { NextRequest } from "next/server";
import { applicationService } from "@/modules/applications/application.service";
import { applicationListQuerySchema, createApplicationSchema } from "@/modules/applications/application.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const applicationController = {
  async apply(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createApplicationSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid application payload", parsed.error.flatten());
    }

    const application = await applicationService.apply(context.user.id, context.user.id, parsed.data);
    return ApiResponse.created(application, "Application submitted successfully");
  },

  async withdraw(request: NextRequest, context: AuthContext) {
    const applicationId = context.params?.id;
    if (!applicationId) {
      throw new ValidationError("Application id is required");
    }

    const result = await applicationService.withdraw(applicationId, context.user.id);
    return ApiResponse.success(result, "Application withdrawn successfully");
  },

  async history(request: NextRequest, context: AuthContext) {
    const query = applicationListQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );
    if (!query.success) {
      throw new ValidationError("Invalid query parameters", query.error.flatten());
    }

    const result = await applicationService.getHistoryForStudent(
      context.user.id,
      query.data.cursor,
      query.data.limit,
      query.data.status
    );
    return ApiResponse.success(result, "Application history retrieved");
  },
};

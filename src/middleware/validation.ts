import { z, ZodType } from 'zod';
import { errorResponse } from './auth';

export async function validateRequestBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<
  | { valid: true; data: T; response?: undefined }
  | { valid: false; data?: undefined; response: Response }
> {
  try {
    const clonedRequest = request.clone();
    const body = await clonedRequest.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
      return {
        valid: false,
        response: errorResponse('Validation failed', errors),
      };
    }

    return { valid: true, data: result.data as T };
  } catch (error) {
    return {
      valid: false,
      response: errorResponse('Invalid JSON body'),
    };
  }
}

export function validateQueryParams<T>(
  queryParams: Record<string, any>,
  schema: ZodType<T>
): { valid: true; data: T; response?: undefined } | { valid: false; data?: undefined; response: Response } {
  try {
    const result = schema.safeParse(queryParams);

    if (!result.success) {
      const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
      return {
        valid: false,
        response: errorResponse('Invalid query parameters', errors),
      };
    }

    return { valid: true, data: result.data as T };
  } catch (error) {
    return {
      valid: false,
      response: errorResponse('Query validation failed'),
    };
  }
}

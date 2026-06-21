import { ZodSchema } from 'zod';
import { errorResponse } from './auth';

export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema
): Promise<{ valid: boolean; data?: T; response?: Response }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
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
  schema: ZodSchema
): { valid: boolean; data?: T; response?: Response } {
  try {
    const result = schema.safeParse(queryParams);

    if (!result.success) {
      const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
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

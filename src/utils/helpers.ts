export function generatePaginationMeta(page: number, limit: number, total: number) {
  const pages = Math.ceil(total / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalItems: total,
    totalPages: pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  };
}

export function formatErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function isValidMongoId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && key !== 'password') {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

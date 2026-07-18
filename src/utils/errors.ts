import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: any): NextResponse<ApiResponse> {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request format',
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    },
    { status: 500 }
  );
}

export function throwError(statusCode: number, message: string, errors?: string[]): never {
  throw new AppError(statusCode, message, errors);
}

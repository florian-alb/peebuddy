import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    offset?: number;
    limit?: number;
    [key: string]: any;
  };
};

export type ApiErrorResponse = {
  error: string;
  details?: any;
};

/**
 * Creates a standardized successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiResponse<T>["meta"],
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    data,
    ...(meta && { meta }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Creates a standardized error API response
 */
export function createErrorResponse(
  message: string,
  details?: any,
  status: number = 500
): NextResponse {
  const response: ApiErrorResponse = {
    error: message,
    ...(details && { details }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Handles common API errors and returns appropriate responses
 */
export function handleApiError(error: unknown, customMessage?: string): NextResponse {
  console.error("API Error:", error);
  
  // Handle Prisma errors
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    
    // Prisma not found error
    if (err.code === "P2025") {
      return createErrorResponse("Resource not found", undefined, 404);
    }
    
    // Prisma unique constraint violation
    if (err.code === "P2002") {
      return createErrorResponse(
        "A resource with this identifier already exists",
        { fields: err.meta?.target },
        409
      );
    }
    
    // Prisma foreign key constraint violation
    if (err.code === "P2003") {
      return createErrorResponse(
        "Related resource not found",
        { field: err.meta?.field_name },
        400
      );
    }
  }
  
  // Default error response
  return createErrorResponse(
    customMessage || "An unexpected error occurred",
    process.env.NODE_ENV === "development" ? String(error) : undefined
  );
}

/**
 * Safely parses JSON from request body
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T;
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields<T>(
  body: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missing: (keyof T)[] } {
  const missing = requiredFields.filter(field => body[field] === undefined);
  return {
    valid: missing.length === 0,
    missing
  };
}

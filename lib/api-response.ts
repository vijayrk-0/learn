import { NextResponse } from 'next/server';

/**
 * Standard error response format
 */
export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode: number;
}

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
    success: true;
    message?: string;
    data?: T;
}

/**
 * Create standardized error response
 */
export function errorResponse(
    message: string,
    statusCode: number = 500,
    error?: string
): NextResponse<ErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            message,
            error,
            statusCode,
        },
        { status: statusCode }
    );
}

/**
 * Create standardized success response
 */
export function successResponse<T = any>(
    data?: T,
    message?: string,
    statusCode: number = 200
): NextResponse<SuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status: statusCode }
    );
}

/**
 * HTTP status codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

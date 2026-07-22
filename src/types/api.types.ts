export interface ApiSuccessResponse<T> {
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    // Additional error details may be included for validation errors.
    errors?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

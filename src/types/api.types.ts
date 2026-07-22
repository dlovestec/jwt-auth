export interface ApiSuccessResponse<T> {
  message?: string;
  data: T;
}

export interface ApiErrorResponse {}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ErrorResponse = {
    success: false;
    message: string;
    errors: string[];
}

export type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
}
export type Response<T> = ErrorResponse | SuccessResponse<T>;
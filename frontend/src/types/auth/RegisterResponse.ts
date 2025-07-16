export interface RegisterErrorResponse {
    success: false;
    message: string;
}

export interface RegisterSuccessResponse {
    success: true;
    message: string;
    data: {
        user: {
        _id: string;
        email: string;
        }
    };
    accessToken: string;
    refreshToken: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
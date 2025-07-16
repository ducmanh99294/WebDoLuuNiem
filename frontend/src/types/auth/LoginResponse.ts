export interface LoginSuccessResponse {
    success: true;
    message: string;
    data: {
        user_id: string;
        role: string;
        name: string;
        image: string;
        accessToken: string;
        refreshToken: string; 
    };
}

export interface LoginErrorResponse {
    success: false;
    message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
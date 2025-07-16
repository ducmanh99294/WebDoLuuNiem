export interface GenerateSuccessOTPResponse {
    success: true;
    message: string;
}

export interface GenerateErrorOTPResponse {
    success: false;
    message: string;
}

export type GenerateOTPResponse = GenerateSuccessOTPResponse | GenerateErrorOTPResponse;
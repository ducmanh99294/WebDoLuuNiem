import { fetcher } from './base';
import type { RegisterResponse } from '../types/auth/RegisterResponse';
import type { GenerateOTPResponse } from '../types/auth/GenerateOTPResponse';
import type { LoginResponse } from '../types/auth/LoginResponse';

export const generateOTP = async (email: string, action: string) => {
    return await fetcher<GenerateOTPResponse>('/auth/request-otp', { 
        method: 'POST',
        body: JSON.stringify({ email, action }),
     });
};

export const register = async (email: string, otp: string, password: string) => {
    return await fetcher<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password }),
    });
}

export const loginWithGoogle = async () => {
    return await fetcher<LoginResponse>('/auth/google', {
        method: 'GET'
    });
}
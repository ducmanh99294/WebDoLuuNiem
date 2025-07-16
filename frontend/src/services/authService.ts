import { generateOTP, register, loginWithGoogle } from "../api/identityAPI";

export const getOTP = async (email: string, action: string) => {
    try {
        const result = await generateOTP(email, action);
        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error("Error generating OTP:", error);
        throw error;
    }
};

export const registerUser = async (email: string, otp: string, password: string) => {
    try {
        const result = await register(email, otp, password);
        if (!result.success) {
            return { success: false, message: result.message };
        } else {
            return {
                success: true,
                message: result.message,
                data: result.data,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            };
        }
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const LoginWithGoogle = async () => {
    try {
        const result = await loginWithGoogle();
        if (result.success) {
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error("Error logging in with Google:", error);
        throw error;
    }
};

export default {
    getOTP,
    registerUser,
};
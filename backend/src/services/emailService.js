const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const OTP = require('../models/OTP');
const crypto = require('crypto');
const logger = require('../utils/logger'); // Assuming you have a logger utility
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, name, text, html) => {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "welcome to our store",
        text: "Hi ${name}, Thanks you for register!",
        html: `<p>Dear ${name},</p><p>${text}</p>`,
    };

    try {
        await sgMail.send(msg);
        logger.info('Email sent successfully');
    } catch (error) {
        logger.error('Error sending email:', error);
        if (error.response) {
            logger.error('Response body:', error.response.body);
        }
    }
}

const sendOTP = async (email, purpose) => {

    if (purpose !== 'register') {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error('Email does not exist', email);
            throw new Error('Email does not exist.');
        }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp, purpose, newEmail });

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
        html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };

    try {
        await sgMail.send(msg);
        logger.info('OTP sent successfully');
    } catch (error) {
        logger.error('Error sending OTP:', error);
        if (error.response) {
            logger.error('Response body:', error.response.body);
        }
    }
}

const verifyOTP = async (email, otp, purpose) => {
    try {
        const otpRecord = await OTP.findOne({ "email": email, "otp": otp, "purpose": purpose });
        if (!otpRecord) {
            return { success: false, message: 'Invalid or expired OTP code.' };
        }

        // Xóa OTP sau khi xác minh thành công
        await OTP.deleteOne({ email, otp, purpose });
        return { success: true, message: 'OTP verification successful.' };
    } catch (error) {
        logger.error('Error verifying OTP:', error);
        throw new Error('Unable to verify OTP. Please try again.');
    }
}

module.exports = {
    sendEmail,
    sendOTP,
    verifyOTP
};
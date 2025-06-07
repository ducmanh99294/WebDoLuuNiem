const sgMail = require('@sendgrid/mail');
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
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('Response body:', error.response.body);
        }
    }
}

const sendOTP = async (to, otp) => {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
        html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        if (error.response) {
            console.error('Response body:', error.response.body);
        }
    }
}

module.exports = {
    sendEmail,
    sendOTP,
};
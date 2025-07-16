const crypto = require('crypto');
const OTP = require('../models/OTP');
const logger = require('./logger');

const generateOTP = async (email, purpose) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const newOTP = await OTP.create({ email, otp, purpose });

    if (!newOTP) {
        throw new Error('Failed to generate OTP');
    }
    return { otp, email, purpose };
}

module.exports = generateOTP;
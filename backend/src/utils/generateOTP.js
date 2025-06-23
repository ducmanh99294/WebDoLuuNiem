const crypto = require('crypto');
const OTP = require('../models/OTP');

const generateOTP = async (email, purpose) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.create({ email, otp, purpose });
    return { otp, email, purpose };
}

module.exports = generateOTP;
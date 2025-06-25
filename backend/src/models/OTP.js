const e = require('express');
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['register', 'change_password', 'update_email'] },
  newEmail: { type: String }, 
  createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
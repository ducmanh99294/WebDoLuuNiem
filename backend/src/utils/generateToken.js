require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
// Tạo access token và refresh token
const generateToken = async (user) => {
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    const newToken = await RefreshToken.create({
        token: refreshToken,
        access_token: accessToken,
        user_id: user._id,
        expiresAt
    });

    if (!newToken) throw new Error('Failed to save refreshToken');

    return { accessToken, refreshToken }
}

module.exports = generateToken;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const generateToken = async (user) => {
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 7); 

    const newToken = await RefreshToken.create({
        token: refreshToken,
        user_id: user.id,
        expiresAt
    });

    if (!newToken) throw new Error('Failed to save refreshToken');

    return { accessToken, refreshToken }
    
}

module.exports = generateToken;
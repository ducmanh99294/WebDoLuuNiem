const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/identityControllers');
const logger = require('../utils/logger');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const router = express.Router();

// Example routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutUser)
router.post('/request-otp',  async (req, res) => {
    try {
        // This route is for requesting an OTP
        // Implement your logic here
        const { email, action } = req.body;
        if (!email || !action) {
            return res.status(400).json({ success: false, message: 'Email and action are required' });
        }

        const user = User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await generateOTP(email, action);

        logger.info('OTP requested successfully');
        res.status(200).json({ success: true, smessage: 'OTP requested successfully'});
    } catch (error) {
        logger.error('Error requesting OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to request OTP' });
    }
});

module.exports = router;
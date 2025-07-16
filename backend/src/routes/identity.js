const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/identityControllers');
const logger = require('../utils/logger');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

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

        if (action === 'change_password') {
            const user = User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }
        
        if (action === 'register') {
            let user = await User.findOne({ email });
            if (user) {
                logger.warn(`User already exists with email: ${email}`);
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }
            
        }

        const { otp } = await generateOTP(email, action);

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
            return res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
        
        logger.info('OTP requested successfully');
        res.status(200).json({ success: true, message: 'OTP requested successfully'});
    } catch (error) {
        logger.error('Error requesting OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to request OTP' });
    }
});

module.exports = router;
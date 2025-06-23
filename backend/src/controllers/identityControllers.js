const logger = require('../utils/logger');
const User = require('../models/User');
const generateAuthToken = require('../utils/generateToken');
const { validationRegistration, validationLogin } = require('../utils/validation/validation');
const RefreshToken = require('../models/RefreshToken');

const registerUser = async (req, res) => {
    try {
        logger.info('Registering new user...');
        const { error } = validationRegistration(req.body);

        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            logger.warn(`User already exists with email: ${email}`);
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        user = new User({
            email,
            password
        });

        await user.save();

        logger.info(`User registered successfully: ${user._id}`);
        const { accessToken, refreshToken } = await generateAuthToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: user._id,
                    email: user.email
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        logger.error(`Error during user registration: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const loginUser = async (req, res) => {
    try {
        logger.info('User login attempt...');
        const { error } = validationLogin(req.body);

        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        logger.info(`User login attempt for email: ${email}`);

        if (!user) {
            logger.warn('Invalid');
            return res.status(401).json({
                success: false,
                message: 'Invalid email'
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            logger.warn('Invalid password');
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        logger.info(`User logged in successfully: ${user._id}`);

        const { accessToken, refreshToken } = await generateAuthToken(user);
        console.log(`Access Token: ${accessToken}`);

        await RefreshToken.deleteMany({
            user_id: user._id
        })

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                user_id: user._id,
                role: user.role,
                name: user.name,
                ////////
                image:user.image,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        logger.error(`Error during user login: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error ${error.message}`,
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        logger.info('Refreshing token...');
        const { refreshToken } = req.body;

        if (!refreshToken) {
            logger.warn('Refresh token is required');
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const token = await RefreshToken.findOne({ token: refreshToken });
        if (!token || token.expiredAt < new Date()) {
            logger.warn('Invalid refresh token');

            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const user = await User.findById(token.user_id);

        if (!user) {
            logger.warn('User not found for the provided refresh token');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { accessToken, newRefreshToken } = await generateAuthToken(user);
        await RefreshToken.deleteMany({ user_id: user._id });

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        logger.error(`Error during token refresh: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        logger.info('User logout attempt...');
        const { refreshToken } = req.body;

        if (!refreshToken) {
            logger.warn('Refresh token is required for logout');
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        await RefreshToken.deleteOne({ token: refreshToken });
        logger.info(`Refresh token delete for logout`);

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });

    } catch (error) {
        logger.error(`Error during user logout: ${error.message}`);
        return res.status(500).json({
success: false,
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
};
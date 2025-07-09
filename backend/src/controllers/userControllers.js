const User = require('../models/User');
const { sendEmail, sendOTP, verifyOTP } = require('../services/emailService');
const { validationUser, validationUpdateUser } = require('../utils/validation/validation');
const { updateUserValidation } = require('../utils/validation/userValidation');
const logger = require('../utils/logger');

// [GET] /users
exports.getAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users...');
        const users = await User.find().select('-password');
        
        logger.info(`Total users retrieved: ${users.length}`);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (err) {
        logger.error(`Error fetching users: ${err.message}`);
        res.status(500).json({ 
            success: false,
            error: 'Internal Server Error' 
        });
    }
};

// [GET] /users/:id
exports.getUserById = async (req, res) => {
    try {
        logger.info(`Fetching user with ID: ${req.params.id}`);

        if (!req.params.id) {
            logger.warn('User ID is required');
            return res.status(400).json({ 
                success: false,
                error: 'User ID is required' 
            });
        }

        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            logger.warn(`User not found with ID: ${req.params.id}`);

            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }
        logger.info(`User retrieved successfully: ${user._id}`);
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (err) {
        logger.error(`Error fetching user: ${err.message}`);
        res.status(400).json({ error: 'Invalid user ID' });
    }
};

// [POST] /users
exports.createUser = async (req, res) => {
    try {
        logger.info('Creating a new user...');

        const { error } = validationUser(req.body);

        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({ 
                success: false,
                error: error.details[0].message 
            });
        }

        const { name, email, password, birthday, address, phone, role, image } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Email already exists: ${email}`);
            
            return res.status(409).json({ 
                success: false,
                error: 'Email already exists' 
            });
        }

        const user = new User({ name, email, password, birthday, address, phone, role, image });
        await user.save();
        await sendEmail(user.email, user.name);
        
        logger.info(`User created successfully: ${user._id}`);
        res.status(201).json({ 
            success: true,
            message: 'User created successfully', 
            user: { ...user._doc, password: undefined } 
        });
    } catch (err) {
        logger.error(`Error creating user: ${err.message}`);
        res.status(400).json({ 
            success: false,
            error: 'Failed to create user', 
            details: err.message 
        });
    }
};

// [PUT] /users/:id
exports.updateUser = async (req, res) => {
    try {
        logger.info(`Updating user with ID: ${req.params.id}`);
        
        if (!req.params.id) {
            logger.warn('User ID is required for update');
            
            return res.status(400).json({ 
                success: false,
                error: 'User ID is required' 
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            logger.warn(`User not found with ID: ${req.params.id}`);
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        const { error } = validationUpdateUser(req.body);

        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);

            return res.status(400).json({ 
                success: false,
                error: error.details[0].message 
            });
        }
        const updates = req.body;
        if (updates.password) {
            updates.password = await require('argon2').hash(updates.password);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        if (!updatedUser) {
            logger.warn(`User not found for update with ID: ${req.params.id}`); 
            
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        logger.info(`User updated successfully: ${updatedUser._id}`);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (err) {
        logger.error(`Error updating user: ${err.message}`);
        res.status(400).json({ 
            success: false,
            error: 'Failed to update user', 
            details: err.message });
    }
};

// [DELETE] /users/:id
exports.deleteUser = async (req, res) => {
    try {
        logger.info(`Deleting user with ID: ${req.params.id}`);
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            logger.warn(`User not found for deletion with ID: ${req.params.id}`);

            return res.status(404).json({ 
                success: false,
                error: 'User not found'
            });
        }
        logger.info(`User deleted successfully: ${deletedUser._id}`);
        res.status(200).json({ 
            success: true,
            message: 'User deleted successfully' 
        });
    } catch (err) {
        logger.error(`Error deleting user: ${err.message}`);
        res.status(400).json({ 
            success: false,
            error: 'Failed to delete user', 
            details: err.message 
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        logger.info('Resetting password...');
        const { email, newPassword, otp } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters long'
            });
        }
        const verify = await verifyOTP(email, otp, 'change_password');
        if (!verify.success) {
            logger.warn(`OTP verification failed: ${verify.message}`);
            return res.status(400).json({ 
                success: false,
                error: verify.message 
            });
        }

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: 'Email is required' 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        const isValidPassword = await user.comparePassword(newPassword);
        if (isValidPassword) {
            return res.status(400).json({ 
            success: false,
            error: 'New password must be different from the old password' 
            });
        }

        await user.updateOne({ password: newPassword });
        res.status(200).json({ 
            success: true,
            message: 'Password reset successfully' 
        });
    } catch (err) {
        logger.error(`Error in resetPassword: ${err.message}`);
        res.status(500).json({ 
            success: false,
            error: 'Internal Server Error',
            details: err.message 
        });
    }
}

exports.updateInfo = async (req, res) => {
    try{
        logger.info('Updating user information...');
        const { error } = updateUserValidation(req.body);
        if (req.params.id !== req.user.id) {
            logger.warn('User ID mismatch in update request');
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to update this user information'
            });
        }

        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({ 
                success: false,
                error: error.details[0].message 
            });
        }
        const user = req.user;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(user.id, updates, { new: true }).select('-password');
        
        logger.info(`User information updated successfully: ${updatedUser._id}`);
        res.status(200).json({
            success: true,
            message: 'User information updated successfully',
            data: updatedUser
        });
    } catch (error) {
        logger.error(`Error in updateInfo: ${error.message}`);
        res.status(500).json({ 
            success: false,
            error: 'Internal Server Error',
            details: error.message 
        });
    }
}

// [GET] /api/v1/admins
exports.getAvailableAdmin = async (req, res) => {
    try {
        logger.info('Fetching available admin...');
        const admin = await User.findOne({ role: 'admin' }).select('_id');
        if (!admin) {
            logger.warn('No admin found in the database');
            return res.status(404).json({
                success: false,
                message: 'No admin found'
            });
        }
        logger.info(`Admin retrieved successfully: ${admin._id}`);
        res.status(200).json({
            success: true,
            message: 'Admin retrieved successfully',
            adminId: admin._id
        });
    } catch (err) {
        logger.error(`Error fetching admin: ${err.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin',
            details: err.message
        });
    }
};
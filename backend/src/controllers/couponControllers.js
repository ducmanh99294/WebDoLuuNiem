const Coupon = require('../models/Coupon');
const logger = require('../utils/logger');

const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiry_date, applicable_users } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            logger.warn(`Coupon already exists with code: ${code}`);
            return res.status(400).json({
                success: false,
                message: 'Coupon already exists'
            });
        }

        const coupon = await Coupon.create({ code, discount, expiry_date, applicable_users });
        logger.info(`Coupon created successfully: ${coupon._id}`);
        res.status(201).json({
            success: true,
            data: coupon
        });
    } catch (e) {
        logger.error(`Error creating coupon: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().populate('applicable_users', 'name email');
        logger.info(`Retrieved ${coupons.length} coupons`);
        res.status(200).json({
            success: true,
            message: 'Coupons retrieved successfully',
            data: coupons
        });
    } catch (e) {
        logger.error(`Error retrieving coupons: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).populate('applicable_users');
        if (!coupon) {
            logger.warn(`Coupon not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        logger.info(`Coupon retrieved successfully: ${coupon._id}`);
        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (e) {
        logger.error(`Error retrieving coupon: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('applicable_users');
        if (!coupon) {
            logger.warn(`Coupon not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        logger.info(`Coupon updated successfully: ${coupon._id}`);
        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (e) {
        logger.error(`Error updating coupon: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            logger.warn(`Coupon not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        logger.info(`Coupon deleted successfully: ${coupon._id}`);
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (e) {
        logger.error(`Error deleting coupon: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};


module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
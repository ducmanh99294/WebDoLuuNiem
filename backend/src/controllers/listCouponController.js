const listCoupon = require('../models/listCoupon');
const logger = require('../utils/logger');

const getListCouponByUserId = async (req, res) => {
    try {
        const userId = req.user._id;
        logger.info(`Fetching coupons for user ID: ${userId}`);
        const listCoupons = await listCoupon.find({ user: userId }).populate('coupon');

        logger.debug(`List of coupons found: ${JSON.stringify(listCoupons)}`);
        if (!listCoupons || listCoupons.length === 0) {
            logger.warn(`No coupons found for user ID: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'No coupons found for this user'
            });
        }

        logger.info(`Retrieved ${listCoupons.length} coupons for user ID: ${userId}`);
        res.status(200).json({
            success: true,
            data: listCoupons
        });
    } catch (error) {
        logger.error(`Error retrieving coupons for user ID ${req.user._id}: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const addCouponToUser = async (req, res) => {
    try {
        const { couponId } = req.body;
        const userId = req.user._id;

        logger.info(`Adding coupon ID: ${couponId} to user ID: ${userId}`);
        const existingCoupon = await listCoupon.findOne({ coupon: couponId, user: userId }).populate('coupon').populate('user');

        if (existingCoupon) {
            logger.warn(`Coupon ID: ${couponId} already exists for user ID: ${userId}`);
            return res.status(400).json({
                success: false,
                message: 'Coupon already exists for this user'
            });
        }

        const newListCoupon = (await listCoupon.create({ coupon: couponId, user: userId })).populate('coupon').populate('user');
        logger.info(`Coupon ID: ${couponId} added successfully for user ID: ${userId}`);
        res.status(201).json({
            success: true,
            data: newListCoupon
        });
    } catch (error) {
        logger.error(`Error adding coupon for user ID ${req.user._id}: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const removeCouponFromUser = async (req, res) => {
    try {
        const { couponId } = req.body;
        const userId = req.user._id;

        logger.info(`Removing coupon ID: ${couponId} from user ID: ${userId}`);
        const listCouponEntry = await listCoupon.findOneAndDelete({ coupon: couponId, user: userId });

        if (!listCouponEntry) {
            logger.warn(`Coupon ID: ${couponId} not found for user ID: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'Coupon not found for this user'
            });
        }

        logger.info(`Coupon ID: ${couponId} removed successfully for user ID: ${userId}`);
        res.status(200).json({
            success: true,
            message: 'Coupon removed successfully'
        });
    } catch (error) {
        logger.error(`Error removing coupon for user ID ${req.user._id}: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getListCouponByUserId,
    addCouponToUser,
    removeCouponFromUser
};
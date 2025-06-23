const CartDetail = require('../models/CartDetail');
const logger = require('../utils/logger'); // Adjust path as needed
const { validateCartDetail } = require('../utils/validation/cartDetailValidation'); // Adjust path as needed

// [POST] /cart-details
exports.createCartDetail = async (req, res) => {
    try {
        logger.info('Creating a new cart detail...');
        const { error } = validateCartDetail(req.body);
        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        const cartDetail = new CartDetail(req.body);
        await cartDetail.save();
        logger.info(`Cart detail created successfully: ${cartDetail._id}`);
        res.status(201).json({
            success: true,
            message: 'Cart detail created successfully',
            cartDetail
        });
    } catch (err) {
        logger.error(`Error creating cart detail: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to create cart detail',
            details: err.message
        });
    }
};

// [GET] /cart-details
exports.getAllCartDetails = async (req, res) => {
    try {
        logger.info('Fetching all cart details...');
        const cartDetails = await CartDetail.find();
        res.status(200).json({
            success: true,
            cartDetails
        });
    } catch (err) {
        logger.error(`Error fetching cart details: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch cart details',
            details: err.message
        });
    }
};

// [GET] /cart-details/cart/:cart_id
exports.getCartDetailsByCartId = async (req, res) => {
    try {
        const { cart_id } = req.params;
        logger.info(`Fetching cart details by cart_id: ${cart_id}`);
        const cartDetails = await CartDetail.find({ cart_id });
        res.status(200).json({
            success: true,
            cartDetails
        });
    } catch (err) {
        logger.error(`Error fetching cart details by cart_id: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch cart details by cart_id',
            details: err.message
        });
    }
};

// [GET] /cart-details/:id
exports.getCartDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Fetching cart detail by id: ${id}`);
        const cartDetail = await CartDetail.findById(id);
        if (!cartDetail) {
            logger.warn(`Cart detail not found: ${id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart detail not found'
            });
        }
        res.status(200).json({
            success: true,
            cartDetail
        });
    } catch (err) {
        logger.error(`Error fetching cart detail by id: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch cart detail',
            details: err.message
        });
    }
};

// [PUT] /cart-details/:id
exports.updateCartDetail = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Updating cart detail: ${id}`);
        const { error } = validateCartDetail(req.body);
        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        const cartDetail = await CartDetail.findByIdAndUpdate(id, req.body, { new: true });
        if (!cartDetail) {
            logger.warn(`Cart detail not found: ${id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart detail not found'
            });
        }
        logger.info(`Cart detail updated successfully: ${id}`);
        res.status(200).json({
            success: true,
            message: 'Cart detail updated successfully',
            cartDetail
        });
    } catch (err) {
        logger.error(`Error updating cart detail: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to update cart detail',
            details: err.message
        });
    }
};

// [DELETE] /cart-details/:id
exports.deleteCartDetail = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Deleting cart detail: ${id}`);
        const cartDetail = await CartDetail.findByIdAndDelete(id);
        if (!cartDetail) {
            logger.warn(`Cart detail not found: ${id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart detail not found'
            });
        }
        logger.info(`Cart detail deleted successfully: ${id}`);
        res.status(200).json({
            success: true,
            message: 'Cart detail deleted successfully'
        });
    } catch (err) {
        logger.error(`Error deleting cart detail: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to delete cart detail',
            details: err.message
        });
    }
};

// [PATCH] /cart-details/:id/quantity
exports.updateCartDetailQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        logger.info(`Updating quantity for cart detail: ${id}`);
        if (typeof quantity !== 'number' || quantity < 1) {
            logger.warn('Invalid quantity value');
            return res.status(400).json({
                success: false,
                error: 'Invalid quantity value'
            });
        }
        const cartDetail = await CartDetail.findByIdAndUpdate(id, { quantity }, { new: true });
        if (!cartDetail) {
            logger.warn(`Cart detail not found: ${id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart detail not found'
            });
        }
        logger.info(`Cart detail quantity updated successfully: ${id}`);
        res.status(200).json({
            success: true,
            message: 'Cart detail quantity updated successfully',
            cartDetail
        });
    } catch (err) {
        logger.error(`Error updating cart detail quantity: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to update cart detail quantity',
            details: err.message
        });
    }
};
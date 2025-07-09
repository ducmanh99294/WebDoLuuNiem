const CartService = require('../services/cartService');
const Cart = require('../models/Cart');
const CartDetail = require('../models/CartDetail');
const logger = require('../utils/logger'); // Adjust path as needed

// [POST] /carts
exports.createCart = async (req, res) => {
    try {
        logger.info('Creating a new cart...');
        const data = {
            user: req.user.id,
            total_price: 0
        }
        const cart = await CartService.createCart(data);

        logger.info(`Cart created successfully: ${cart._id}`);
        res.status(201).json({
            success: true,
            message: 'Cart created successfully',
            data: cart
        });
    } catch (err) {
        logger.error(`Error creating cart: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to create cart',
            details: err.message
        });
    }
};

// [GET] /carts
exports.getAllCarts = async (req, res) => {
    try {
        logger.info('Fetching all carts...');
        const carts = await CartService.getAllCarts();
        res.status(200).json({
            success: true,
            data: carts
        });
    } catch (err) {
        logger.error(`Error fetching carts: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch carts',
            details: err.message
        });
    }
};

// [GET] /carts/:id
exports.getCartById = async (req, res) => {
    try {
        logger.info(`Fetching cart with ID: ${req.params.id}`);
        const cart = await CartService.getCartById(req.params.id);
        if (!cart) {
            logger.warn(`Cart not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        logger.error(`Error fetching cart: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch cart',
            details: err.message
        });
    }
};

// [PUT] /carts/:id
exports.updateCart = async (req, res) => {
    try {
        logger.info(`Updating cart with ID: ${req.params.id}`);
        // Add validation here if needed

        const updatedCart = await CartService.updateCart(req.params.id, req.body);
        if (!updatedCart) {
            logger.warn(`Cart not found for update with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }
        logger.info(`Cart updated successfully: ${updatedCart._id}`);
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: updatedCart
        });
    } catch (err) {
        logger.error(`Error updating cart: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to update cart',
            details: err.message
        });
    }
};

// [DELETE] /carts/:id
exports.deleteCart = async (req, res) => {
    try {
        logger.info(`Deleting cart with ID: ${req.params.id}`);
        const deletedCart = await CartService.deleteCart(req.params.id);
        if (!deletedCart) {
            logger.warn(`Cart not found for deletion with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }
        logger.info(`Cart deleted successfully: ${deletedCart._id}`);
        res.status(200).json({
            success: true,
            message: 'Cart deleted successfully'
        });
    } catch (err) {
        logger.error(`Error deleting cart: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to delete cart',
            details: err.message
        });
    }
};

// [GET] /carts/user/:userId
exports.getCartByUser = async (req, res) => {
  try {
    console.log('🔍 req.user.id:', req.user.id);
    console.log('🔍 req.params.userId:', req.params.userId);
    console.log('🔍 req.user.role:', req.user.role);
    const requestedUserId = req.params.userId;
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && requestedUserId !== String(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập giỏ hàng của người khác'
      });
    }

    const cart = await Cart.findOne({ user: requestedUserId }).lean();
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    const cartDetails = await CartDetail.find({ cart_id: cart._id }).populate('product_id').lean();

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        cartDetails: cartDetails || []
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
};
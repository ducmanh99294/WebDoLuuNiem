const Cart = require('../models/Cart'); // Adjust the path if your model is elsewhere
const CartDetail = require('../models/CartDetail');
const jwt = require('jsonwebtoken');

// Create a new cart
async function createCart(data) {
    data.total_price = 0; // Đặt total_price mặc định là 0
    const cart = new Cart(data);
    return await cart.save();
}

// Get all carts with cart details
async function getAllCarts() {
    return await Cart.find()
        .lean()
        .then(async carts => {
            const cartIds = carts.map(cart => cart._id);
            const cartDetails = await CartDetail.find({ cart_id: { $in: cartIds } }).populate('product_id').lean();
            // Group cartDetails by cart_id
            const detailsByCart = cartDetails.reduce((acc, detail) => {
                acc[detail.cart_id] = acc[detail.cart_id] || [];
                acc[detail.cart_id].push(detail);
                return acc;
            }, {});
            // Attach cartDetails to each cart
            return carts.map(cart => ({
                ...cart,
                cartDetails: detailsByCart[cart._id] || []
            }));
        });
}

// Get cart by ID
// Get cart by ID with cart details
async function getCartById(id) {
    const cart = await Cart.findById(id).lean();
    if (!cart) return null;
    const cartDetails = await CartDetail.find({ cart_id: id }).populate('product_id').lean();
    return {
        ...cart,
        cartDetails: cartDetails || []
    };
}

// Update cart by ID
async function updateCart(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true });
}

// Delete all cart details by cart ID
async function deleteCartDetailsByCartId(cartId) {
    return await CartDetail.deleteMany({ cart_id: cartId });
}

// Delete cart by ID
async function deleteCart(id) {
    return await Cart.findByIdAndDelete(id);
}

// Get carts by user ID
// Get carts by user ID with cart details
async function getCartsByUser(userId) {
    const carts = await Cart.find({ user: userId }).lean();
    const cartIds = carts.map(cart => cart._id);
    const cartDetails = await CartDetail.find({ cart_id: { $in: cartIds } }).populate('product_id').lean();
    // Group cartDetails by cart_id
    const detailsByCart = cartDetails.reduce((acc, detail) => {
        acc[detail.cart_id] = acc[detail.cart_id] || [];
        acc[detail.cart_id].push(detail);
        return acc;
    }, {});
    // Attach cartDetails to each cart
    return carts.map(cart => ({
        ...cart,
        cartDetails: detailsByCart[cart._id] || []
    }));
}

const getCartByUser = async (userId) => {
  return Cart.findOne({ user: userId });
};

module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    updateCart,
    deleteCart,
    getCartByUser
};
const CartDetail = require('../models/CartDetail'); // Adjust the path as needed

// Create a new cart detail
async function createCartDetail(data) {
    const cartDetail = new CartDetail(data);
    return await cartDetail.save();
}

// Get all cart details
async function getAllCartDetails() {
    return await CartDetail.find();
}

// Get cart details by cart_id
async function getCartDetailsByCartId(cart_id) {
    return await CartDetail.find({ cart_id });
}

// Get cart detail by id
async function getCartDetailById(id) {
    return await CartDetail.findById(id);
}

// Update cart detail by id
async function updateCartDetail(id, data) {
    return await CartDetail.findByIdAndUpdate(id, data, { new: true });
}

// Delete cart detail by id
async function deleteCartDetail(id) {
    return await CartDetail.findByIdAndDelete(id);
}

// Update quantity of a cart detail
async function updateCartDetailQuantity(id, quantity) {
    return await CartDetail.findByIdAndUpdate(id, { quantity }, { new: true });
}

module.exports = {
    createCartDetail,
    getAllCartDetails,
    getCartDetailsByCartId,
    getCartDetailById,
    updateCartDetail,
    deleteCartDetail,
    updateCartDetailQuantity
};
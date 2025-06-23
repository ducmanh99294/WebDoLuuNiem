const mongoose = require('mongoose');

const CartDetailSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
        index: true,
        unique: false
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
        index: true,
        unique: false
    },
    quantity: {
        type: Number,
        default: null
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('CartDetail', CartDetailSchema);
const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
        unique: false
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true,
        unique: false
    },
    quantity: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    sell_count: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
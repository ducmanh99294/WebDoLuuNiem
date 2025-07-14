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
}, {
    timestamps: false
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    expiry_date: {
        type: Date,
        required: true
    },
    applicable_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Coupon = mongoose.model('Coupons', couponSchema);
module.exports = Coupon;

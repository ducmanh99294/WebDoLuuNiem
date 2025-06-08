const mongoose = require('mongoose');
const listCouponSchema = new mongoose.Schema({
    coupon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupons'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ListCoupon', listCouponSchema);
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'paid', 
            'failed', 
            'cancelled',
            'refunded'  
        ],
        default: 'pending'
    },
    method: {
        type: String,
        required: true,
    },
}, {
    collection: 'payments',
    timestamps: false,
});

module.exports = mongoose.model('Payment', PaymentSchema);

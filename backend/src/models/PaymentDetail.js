const mongoose = require('mongoose');
const { use } = require('react');

const paymentDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const PaymentDetail = mongoose.model('PaymentDetails', paymentDetailSchema);
module.exports = PaymentDetail;
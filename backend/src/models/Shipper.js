const mongoose = require('mongoose');

const shipperSchema = new mongoose.Schema({
    shipping_company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingCompanies',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const Shipper = mongoose.model('Shippers', shipperSchema);
module.exports = Shipper;

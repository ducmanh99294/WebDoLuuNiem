const mongoose = require('mongoose');

const shippingCompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const ShippingCompany = mongoose.model('ShippingCompanies', shippingCompanySchema);
module.exports = ShippingCompany;
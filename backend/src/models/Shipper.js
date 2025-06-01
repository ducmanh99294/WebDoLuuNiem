const mongoose = require('mongoose');

const shipperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    shipping_company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingCompanies'
  }
});

const Shipper = mongoose.model('Shippers', shipperSchema);
module.exports = Shipper;
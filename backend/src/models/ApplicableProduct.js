const mongoose = require('mongoose');

const applicableProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
});

const applicableProductModel = mongoose.model('ApplicableProducts', applicableProductSchema);
module.exports = applicableProductModel;

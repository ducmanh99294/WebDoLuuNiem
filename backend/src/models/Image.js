const mongoose = require('mongoose');
const Product = require('./Product');

const imageSchema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Images', imageSchema);
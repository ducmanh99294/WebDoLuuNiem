const mongoose = require('mongoose');
const Product = require('./Product');

const imageSchema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
    },
    image: {
        type: String,
        required: true
    },
});

const Image = mongoose.model('Images', imageSchema);
module.exports = Image;
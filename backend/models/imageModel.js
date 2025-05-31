const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    // product_id: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Products'
    // },
    main_image: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

const Images = mongoose.model('Images', imageSchema);
module.exports = Images;
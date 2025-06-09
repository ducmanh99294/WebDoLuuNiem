const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
    location: {
        type: String,
        required: true
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupons",
        default: null
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images"
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }],
});

const Event = mongoose.model('Events', eventSchema);
module.exports = Event;
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
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    images: [{
        type: String,
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicableProducts"
    }],
});

const Event = mongoose.model('Events', eventSchema);
module.exports = Event;
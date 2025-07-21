const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        minlength: 0,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Reviews', ReviewSchema);
module.exports = Review;
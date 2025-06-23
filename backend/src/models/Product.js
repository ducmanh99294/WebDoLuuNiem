const mongoose = require ('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
   
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
   
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    Coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupons",
        default: null,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images"
    }],
    quantity: {
        type: Number,
        required: true,
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    },
    like_count: {
        type: Number,
        default: 0
   
    },
    view_count: {
        type: Number,
        default: 0
    },

    sell_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { created_at: 'create_at', updated_at: 'update_at' }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product;

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupons",
        default: 0,
        min: 0,
        max: 100 
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
        required: true,
   
    },
    view_count: {
        type: Number,
        required: true,
    },

     sell_count: {
        type: Number,
        required: true,
    },
    created_At: {
        type: Date,
        default: Date.now
    },
    update_At: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { created_At: 'create_At', updated_At: 'update_At' }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product;

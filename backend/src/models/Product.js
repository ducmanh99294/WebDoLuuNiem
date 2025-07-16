const mongoose = require ('mongoose');
const logger = require('../utils/logger'); // Import the logger
const client = require('../config/meiliSearchConfig'); // Import the MeiliSearch client

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

const productIndex = client.index('products');

productSchema.post('save', async function () {
  try {
    logger.info('Indexing product:', this._id);
    await productIndex.addDocuments([{
        id: this._id,
        name: this.name,
        description: this.description,
        rating: this.rating,
        price: this.price,
        discount: this.discount,
        like_count: this.like_count,
        view_count: this.view_count,
        sell_count: this.sell_count,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }]);
  } catch (err) {
    logger.error('Meilisearch Indexing Error:', err.message);
  }
});

productSchema.post('remove', async function () {
    try {
        logger.info('Deleting product from index:', this._id);
        await productIndex.deleteDocument(this._id.toString());
    } catch (err) {
        logger.error('Meilisearch Delete Error:', err.message);
    }
});

const Product = mongoose.model('Products', productSchema);
module.exports = Product;

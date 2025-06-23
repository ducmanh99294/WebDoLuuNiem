const mongoose = require('mongoose');

const likeListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        default: [],
        required: true
    }],
});

const LikeList = mongoose.model('LikeList', likeListSchema, 'like_list');

LikeList.watch().on('change', async (change) => {
    if (['insert', 'delete'].includes(change.operationType)) {
        let productId = null;

        if (change.operationType === 'insert') {
            const insertedDoc = await LikeList.findById(change.documentKey._id);
            productId = insertedDoc?.product;
        } else if (change.operationType === 'delete') {
            productId = change.fullDocument?.product;
        }

        if (productId) {
            const likeCount = await LikeList.countDocuments({ product: productId });
            await mongoose.model('Products').findByIdAndUpdate(productId, { like_count: likeCount });
        }
    }
});

module.exports = LikeList;
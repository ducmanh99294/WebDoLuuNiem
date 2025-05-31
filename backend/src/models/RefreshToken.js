const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    access_token: {
        type: String,
        required: true,
    }
}, {timestamps: {createdAt: 'create_at'}});

RefreshTokenSchema.index({expiresAt: 1}, { expireAfterSeconds: 0 })

const RefreshToken = mongoose.model('refresh_token', RefreshTokenSchema);

module.exports = RefreshToken;

const mongoose = require("mongoose");

const ShippingInfoSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    recipient_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: {
        type: String,
        required: true
    },
    shipping_method: { type: String },
    tracking_number: { type: String, unique: true, sparse: true },
    shipping_status: { type: String, default: "pending" },
    shipped_at: { type: Date },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ShippingInfo", ShippingInfoSchema);
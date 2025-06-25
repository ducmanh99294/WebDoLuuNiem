const Joi = require("joi");

// Validation schema for creating shipping info
const createShippingInfoSchema = Joi.object({
    order_id: Joi.string().required(),
    recipient_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    address: Joi.string().required(),
    shipping_method: Joi.string().optional(),
    tracking_number: Joi.string().optional(),
    shipping_status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").optional(),
    shipped_at: Joi.date().optional(),
    created_at: Joi.date().optional()
});

// Validation schema for updating shipping info
const updateShippingInfoSchema = Joi.object({
    recipient_name: Joi.string().optional(),
    phone_number: Joi.string().optional(),
    address: Joi.string().optional(),
    shipping_method: Joi.string().optional(),
    tracking_number: Joi.string().optional(),
    shipping_status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").optional(),
    shipped_at: Joi.date().optional(),
    created_at: Joi.date().optional()
}).min(1);

function validateCreateShippingInfo(data) {
    return createShippingInfoSchema.validate(data);
}

function validateUpdateShippingInfo(data) {
    return updateShippingInfoSchema.validate(data);
}

module.exports = {
    validateCreateShippingInfo,
    validateUpdateShippingInfo
};
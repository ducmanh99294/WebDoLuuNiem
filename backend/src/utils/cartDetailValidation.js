const Joi = require('joi');
const logger = require('./logger');

// Validation schema for updating CartDetail (PUT/PATCH)
const validateCartDetail = (data) => {
    const schema = Joi.object({
        cart_id: Joi.string().hex().length(24).optional(),
        product_id: Joi.string().hex().length(24).optional(),
        quantity: Joi.number().integer().min(1).optional()
    }).min(1);

    return schema.validate(data);

}

module.exports = {
    validateCartDetail
};
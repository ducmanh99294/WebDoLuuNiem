const Joi = require('joi');

// Validation schema for updating user info
const updateUserValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().allow(null, ''),
        address: Joi.string().allow(null, ''),
        phone: Joi.string().allow(null, ''),
    }).min(1);

    return schema.validate(data);
} // Require at least one field to update

module.exports = {
    updateUserValidation,
};
const joi = require('joi');

const validationCreateCancelRequest = (data) => {
    const schema = joi.object({
        user_id: joi.string().required(),
        order_id: joi.string().required(),
        reason: joi.string().required()
    });

    return schema.validate(data);
};

module.exports = validationCreateCancelRequest;
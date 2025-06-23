const joi = require('joi')
const { password } = require('../../models/User')

const validationRegistration = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })

    return schema.validate(data)
}

const validationLogin = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })

    return schema.validate(data)
}

const validationUser = (data) => {
    const schema = joi.object({
        name: joi.string().min(2).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        phone: joi.string().pattern(/^[0-9]{10,15}$/).optional(),
        role: joi.string().valid('user', 'admin').optional(),
        address: joi.string().max(255).optional(),
        image: joi.string().max(255).optional()
    })

    return schema.validate(data)
}

const validationUpdateUser = (data) => {
    const schema = joi.object({
        name: joi.string().min(2).max(50).optional(),
        email: joi.string().email().optional(),
        password: joi.string().min(6).allow('').optional(),
        phone: joi.string().pattern(/^[0-9]{10,15}$/).optional(),
        role: joi.string().valid('user', 'admin').optional(),
        address: joi.string().max(255).optional(),
        image: joi.string().max(255).optional()
    })

    return schema.validate(data)
}

const validationCreatePayment = (data) => {
    const schema = joi.object({
        order_id: joi.string().required(),
        date: joi.date().required(),
        status: joi.string().valid('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded').optional(),
        method: joi.string().required()
    });

    return schema.validate(data);
};

const validationUpdatePayment = (data) => {
    const schema = joi.object({
        order_id: joi.string().optional(),
        date: joi.date().optional(),
        status: joi.string().valid('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded').optional(),
        method: joi.string().optional()
    });

    return schema.validate(data);
};

module.exports = {
    validationRegistration,
    validationLogin,
    validationUser,
    validationUpdateUser,
    validationCreatePayment,
    validationUpdatePayment
}
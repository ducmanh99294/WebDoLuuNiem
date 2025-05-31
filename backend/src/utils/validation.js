const joi = require('joi')
const { password } = require('../models/User')

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

module.exports = {
    validationRegistration,
    validationLogin
}
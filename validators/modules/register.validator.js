const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'it'] } }),
    roles: Joi.required(),
    password: Joi.string().required().min(5),
})

module.exports = registerSchema
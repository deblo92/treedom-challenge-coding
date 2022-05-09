const Joi = require('joi')
const User = require('../../models/User')

const loginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'it'] } }),
    password: Joi.string().required().min(5),
})


module.exports = loginSchema
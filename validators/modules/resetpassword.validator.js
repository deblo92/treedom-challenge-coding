const Joi = require('joi')

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().min(6),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required()
})

module.exports = resetPasswordSchema
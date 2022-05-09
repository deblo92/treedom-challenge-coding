const loginSchema = require('./modules/login.validator')
const registerSchema = require('./modules/register.validator')
const resetPasswordSchema = require('./modules/resetpassword.validator')

module.exports = {
    registerSchema,
    loginSchema,
    resetPasswordSchema
}
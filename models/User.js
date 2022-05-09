const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    roles: {
        type: Object,
        required: true
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 12
    },
})

module.exports = mongoose.model('User', userSchema)
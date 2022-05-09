const mongoose = require('mongoose')

const tokenScherma = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    revoked:{
        type: Boolean,
        required: true
    },
    created_at:{
        type: Date,
        required: true
    },
    exp_at:{
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Token', tokenScherma)
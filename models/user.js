const mongoose = require('mongoose')

const User = mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
    },
})

module.exports = mongoose.model('User', User);
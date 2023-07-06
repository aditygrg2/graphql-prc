const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Product', Product);
const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    products: {
        // this just stores the index. We need to populate in order to get this we know this yaar. 
        type: [mongoose.Schema.ObjectId],
        ref: 'Product'
    },
    orderDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["PLACED", "STARTED", "PREPARED", "COMPLETED"]
    },
    ordererName: {
        type: String,
    },
})

module.exports = mongoose.model('Order', Order);
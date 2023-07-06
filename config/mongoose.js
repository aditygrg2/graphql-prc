const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@cluster0.2tle4yy.mongodb.net/`)

const db = mongoose.connection;

db.on('open', () => {
    console.log("Connected to database.")
})

module.exports = mongoose
const mongoose = require('mongoose');

const PublisherSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        unique : true
    },
    number: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String
    }

})

module.exports = mongoose.model('publisher', PublisherSchema);
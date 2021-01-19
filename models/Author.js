const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
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
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    }

})

module.exports = mongoose.model('author', AuthorSchema);
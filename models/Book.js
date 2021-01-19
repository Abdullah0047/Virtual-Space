const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    iban: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publisher',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
        required: true
    },
    cover: {
        type: String,
    },
    pdf: {
        type: String,
    },
    rating:{
        type: Number
    }

})

module.exports = mongoose.model('book', BookSchema);
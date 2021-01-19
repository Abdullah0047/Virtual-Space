const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userRole: {
        type: String,
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    flag: {
        type: String,
        default: 'True'
    }

})

module.exports = mongoose.model('user', UserSchema);
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'First name cannot be empty'],
    },
    lname: {
        type: String,
        required: [true, 'Last name cannot be empty']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty'],
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number cannot be empty'],
        minlength: [10, `Phone number must contain 10 digits`],
        maxlength: [10, `Phone number must contain 10 digits`]
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty']
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
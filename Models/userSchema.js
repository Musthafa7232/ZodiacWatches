const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be empty'],
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
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: String,
    },
    updatedOn: {
        type: String
    },
    shippingAddress: {
        type: [{
            state: {
                type: String,
            },
            city: {
                type: String
            },
            address: {
                type: String
            },
            zip: {
                type: Number
            },
            landmark: {
                type: String
            }
        }]
    },
    cart: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },
            quantity: {
                type: Number
            }
        }]
    },
    cartTotal: {
        type: Number,
        default: 0
    },
    wishlist: [{
        type: {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            }
        }
    }]
})
userSchema.pre('save', async function (next) {
    try {
        hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        next();
    } catch (error) {
        console.log(error)
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User
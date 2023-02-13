const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const addressSchema = new mongoose.Schema({
    state: {
        type: String,
    },
    street1: {
        type: String
    },
    street2: {
        type: String
    },
    city: {
        type: String
    },
    landmark: {
        type: String
    },
    zip: {
        type: Number
    }
})
const cartSchema = new mongoose.Schema({
    productId: {
      type: String,
    },
    quantity: {
      type: Number
    }
  })
  
  const wishlistSchema = new mongoose.Schema({
    productId: {
      type: String
    }
  })

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
    updatedOn:{
        type:String
    },
    shippingAddress: [addressSchema],
    cart: [cartSchema],
    wishlist: [wishlistSchema]
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
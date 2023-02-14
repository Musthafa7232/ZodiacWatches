const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code cannot be empty'],
    minLength: [3, 'Coupon code must be atleast 3 characters'],
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Description cannot be empty']
  },
  isPercentage: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    required: [true, 'Discount value cannot be empty']
  },
  minPurchaseValue: {
    type: Number
  },
  expiry: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, 
{
  timestamps: true
})



const Coupon = mongoose.model('Coupon', couponSchema)
module.exports = Coupon

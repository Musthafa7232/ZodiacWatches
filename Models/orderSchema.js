const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },
    productName: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }],
  userAddress: {
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
  phone: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentVerified: {
    type: Boolean,
    default: false
  },
  orderStatus: {
    type: String,
    default: 'Placed'
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  return:{
    type:Boolean,
    default:false
  },
  returnStatus:{
    type:String
  }
},
{
  timestamps: true
})

const Orders = mongoose.model('Orders', orderSchema)
module.exports = Orders
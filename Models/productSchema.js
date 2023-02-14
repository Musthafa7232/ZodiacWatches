const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Product title is required"]
  },
  brand: {
    type: String,
    required: [true, "Brand is required"]
  },
  discription: {
    type: String,
    required: [true, 'Discription cannot be empty']
  },
  highlights: {
    type: String,
    required: [true, 'Highlights cannot be empty']
  },
  colour: {
    type: String,
    required: [true, 'Color cannot be empty']
  },
  price: {
    type: Number,
    required: [true, 'Price cannot be empty']
  },
  images: {
    type: [String],
  },
  totalStock: {
    type: Number,
    required: [true, 'Stock cannot be empty']
  },
  stockLeft: {
    type: Number
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true,'category is required']
  },
  offer:{
    type:Number
  } 
},{
  timestamps: true
}
)

const Products = mongoose.model('Products', productSchema)
module.exports = Products
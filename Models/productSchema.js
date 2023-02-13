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
  highlights: {
    type: String,
    required: [true, 'Highlights cannot be empty']
  },
  specifications: {
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
    required: [true, 'Images cannot be empty']
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
    required: true
  }
}
)


const Products = mongoose.model('Products', productSchema)
module.exports = Products
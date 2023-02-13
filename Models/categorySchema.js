const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category name cannot be empty']
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
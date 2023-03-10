const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category cannot be empty']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  offer:{
    type:Number
  } 
}, 
)



const Category = mongoose.model ('Category', categorySchema)
module.exports = Category
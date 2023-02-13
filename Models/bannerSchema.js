const mongoose=require('mongoose')

const bannerSchema = new mongoose.Schema({
    bannerTitle: {
        type: String,
        required: [true, 'banner name cannot be empty']
      },
      images: {
        type:String,
        required: [true, 'Images cannot be empty']
      },
      isDeleted: {
        type: Boolean,
        default: false
      }
    })



const banner = mongoose.model('banner', bannerSchema)
module.exports = banner
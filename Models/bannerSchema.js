const mongoose=require('mongoose')

const bannerSchema = new mongoose.Schema({
    bannerTitle: {
        type: String,
       
      },
      images: {
        type:String,
        required: [true, 'Images cannot be empty']
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      setDefault:{
        type: Boolean,
        default: false
      }
    })



const banner = mongoose.model('banner', bannerSchema)
module.exports = banner
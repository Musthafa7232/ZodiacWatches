const { login } = require('../controllers/loginControler')
const userModel = require('../Models/userSchema')
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}
const orderSuccess = (req, res, next) => {
  if (req.session.order) {
    next()
  } else {
    res.redirect('/home')
  }
}

const isLoggedOut = (req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    res.redirect('/home')
  }
}

const isUserBlocked = async(req, res, next) => {
  try {
    if(req.session.user){
      const user = await userModel.findById(req.session.user._id)
      if(user.isBlocked){
        req.session.user = null
      }
      next()
    }else{
      next()
    }
  } catch (error) {
    console.log(error);
  }
}

const validateAddress = (req, res, next) => {
  if(!req.body.state){
    req.session.message = 'state cannot be empty'
  }else if(!req.body.city){
    req.session.message = 'City cannot be empty'
  }else if(!req.body.address){
    req.session.message = 'address cannot be empty'
  }else if(!req.body.zip){
    req.session.message = 'Zip cannot be empty'
  }else if(!req.body.landmark){
    req.session.message = 'landmark cannot be empty'
  }else if(!(req.body.zip).match(/^[6]\d{5}$/)){
    req.session.message = 'Enter valid zip code'
  }
  if(req.session.message){
    req.session.address = {
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      landmark: req.body.landmark,
      address: req.body.address
    }
  res.redirect('/addAddress')
  }else{
    next()
  }
}
module.exports = {
  orderSuccess,
  isLoggedIn,
  isLoggedOut,
  isUserBlocked,
  validateAddress
}
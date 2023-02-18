const userModel = require('../Models/userSchema')
const mongoose = require('mongoose')



const getAddress = async (req, res) => {
    try {
      const address = await userModel.aggregate([
        {
          '$match': {
            '_id': mongoose.Types.ObjectId(req.session.user._id)
          }
        }, {
          '$project': {
            'shippingAddress': {
              '$slice': [
                '$shippingAddress', 3
              ]
            },
            'name': 1
          }
        }
      ])
     
      res.render('user/address', { address })
    } catch (err) {
      console.log(err);
    }
  
  }
  
  const getNewaddress = (req, res) => {
    if (req.session.message) {
      const message = req.session.message
      const address = req.session.address
      req.session.message = ""
      req.session.address = ''
      res.render('user/addAddress', { message, address })
    } else {
      const message = ""
      const address = ""
      res.render('user/addAddress', { message, address })
    }
  
  }
  
const addAddress = async (req, res) => {
    try {
      if (req.session.message) res.redirect('/addAddress')
      const user = await userModel.findById(req.session.user._id)
      const { state, city, address, zip, landmark } = req.body
      const details = { state, city, address, zip, landmark }
      await userModel.findOneAndUpdate({ _id: user._id }, { $push: { shippingAddress: details } })
      res.redirect("/addresses")
    } catch (err) {
      console.log(err);
    }
  
  }
  
  const deleteAdddress = async (req, res) => {
    try {
      const id = req.params.id
    
      await userModel.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { shippingAddress: { _id: id } } })
      res.json({
        successStatus: true,
        redirect: '/addresses'
      })
    } catch (err) {
  
    }
  }
  
  const geteditAdddress = async (req, res) => {
    try {
      const id = req.params.id
  
      const user = await userModel.findById(req.session.user._id)
      let address
      user.shippingAddress.forEach(item => {
        if (item._id == id) {
          address = item
        }
      })
      
      res.render('user/editAddress', { address })
    } catch (err) {
      console.log(err)
    }
  }
  
  const editAdddress = async (req, res) => {
    try {
      const id = req.params.id
   
      const { state, city, address, zip, landmark } = req.body
      await userModel.findOneAndUpdate({
        shippingAddress: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(id)
          }
        }
      },
        {
          $set: {
            "shippingAddress.$.state": state,
            "shippingAddress.$.city": city,
            "shippingAddress.$.address": address,
            "shippingAddress.$.zip": zip,
            "shippingAddress.$.landmark": landmark,
          }
        })
  
      res.redirect('/addresses')
    } catch (err) {
      console.log(err)
    }
  }

  module.exports={
    editAdddress,
    geteditAdddress,
    deleteAdddress,
    addAddress,
    getNewaddress,
    getAddress
  }
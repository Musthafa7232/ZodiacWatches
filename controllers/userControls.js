const userModel = require('../Models/userSchema')
const categoryModel = require('../Models/categorySchema');
const productModel = require('../Models/productSchema')
const bannerModel = require('../Models/bannerSchema')
const orderModel = require('../Models/orderSchema')
const mongoose = require('mongoose')
const msg = require("../utils/Twilio");


const getLandingPage = async (req, res) => {
  try {
    const banner = await bannerModel.find({ isDeleted: false })

    const category = await categoryModel.aggregate(
      [
        {
          '$match': {
            'isDeleted': false
          }
        }, {
          '$lookup': {
            'from': 'products',
            'localField': '_id',
            'foreignField': 'categoryId',
            'pipeline': [
              {
                '$match': {
                  'isDeleted': false
                }
              }, {
                '$limit': 3
              }
            ],
            'as': 'products'
          }
        }
      ]
    )
    return res.render("user/landing-page", { banner, category })
  } catch (err) {
    console.log(err);
  }
}

const getHome = async (req, res) => {
  try {
    const banner = await bannerModel.find({ isDeleted: false })

    const category = await categoryModel.aggregate(
      [
        {
          '$match': {
            'isDeleted': false
          }
        }, {
          '$lookup': {
            'from': 'products',
            'localField': '_id',
            'foreignField': 'categoryId',
            'pipeline': [
              {
                '$match': {
                  'isDeleted': false
                }
              }, {
                '$limit': 3
              }
            ],
            'as': 'products'
          }
        }
      ]
    )
    return res.render("user/home", { banner, category })
  } catch (err) {
    console.log(err);
  }

}

const getAbout = (req, res) => {
  return res.render("user/about",{user:req.session?.user?.name})
}



const getProducts = async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1
    let startIndex=(page-1)*4
    let endIndex=page*4
    let searched
    let product
    let category = await categoryModel.find({ isDeleted: false })

    if (req.session.searchKey) {

      searched = req.session.searchKey || ""

      product = await productModel.aggregate([
        {
          '$lookup': {
            'from': 'categories',
            'localField': 'categoryId',
            'foreignField': '_id',
            'as': 'categoryId'
          }
        }, {
          '$unwind': {
            'path': '$categoryId'
          }
        }, {
          '$match': {
            'isDeleted': false,

          }
        }, {
          '$match': {
            $or: [
              { productName: new RegExp(searched, 'i') },
              { colour: new RegExp(searched, 'i') },
              { 'categoryId.categoryName': new RegExp(searched, 'i') },
              { brand: new RegExp(searched, 'i') }
            ]

          }
        }
      ])
  
    } else if (req.session.sort || req.session.from || req.session.to || req.session.categoryId) {

      const from = req.session.from || 0
      const to = req.session.to || 10000000
      let productName = -1
      if (req.session.sort == 1) {
        productName = 1
       
      } else if (req.session.sort == -1) {
        productName = -1
      }
      req.session.sort = null
      req.session.from = null
      req.session.to = null

      const categoryArray = []
      category.forEach(item => {
        categoryArray.push(item._id)
      })

      let categoryies = []
      if (req.session.categoryId) {
        categoryies.push(mongoose.Types.ObjectId(req.session.categoryId))
        
        req.session.categoryId = null
      } else {
        categoryies = categoryArray
       
      }


      product = await productModel.aggregate([
        {
          $match: {
            'isDeleted': false,

            $and: [
              { 'price': { $gte: parseInt(from) } },
              { 'price': { $lte: parseInt(to) } },
            ],
            categoryId: { $in: categoryies },
          }
        },
        {
          $sort: {
            productName,
          }

        }
      ])
    
    } else {

      product = await productModel.find({ isDeleted: false })

    }
    

 let next 
 let prev
  
let products=product.slice(startIndex,endIndex)


if(startIndex>0){
  prev={page:page-1}
   
}
   

if(endIndex<product.length){
   next={page:page+1}
 
}
 


    res.render('user/watches', { products, searched, category,page,prev,next,user:req.session?.user?.name})
  } catch (err) {
    console.log(err);
  }
}

const filter = async (req, res) => {
  req.session.searchKey = req.body.search
  req.session.sort = req.body.sort
  req.session.from = req.body.from
  req.session.to = req.body.to
  req.session.categoryId = req.body.categoryId

  
  res.redirect('/products')

}


const productSingleview = async (req, res) => {
  try {
    const id = req.params.id
    const product = await productModel.findById(id)
    if (req.session.user) {
      const user = await userModel.findById(req.session.user._id).populate('wishlist.productId')
      let wishlist
      user.wishlist.forEach(item => {
        if (item.productId._id == id)
          wishlist = item.productId
      })
      res.render('user/singleView', { product, wishlist, user: true })
    } else {
      const wishlist = ""
      res.render('user/singleView', { product, wishlist, user: false })
    }

  } catch (err) {
    console.log(err);
  }

}


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

const orderDetails = async (req, res) => {
  try {
    const id = req.params.id

    const order = await orderModel.aggregate([
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(id)
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'userId',
          'foreignField': '_id',
          'as': 'userId'
        }
      }, {
        '$lookup': {
          'from': 'coupons',
          'localField': 'couponId',
          'foreignField': '_id',
          'as': 'couponId'
        }
      }, {
        '$unwind': '$userId'

      }
    ])

    res.render('user/order-details', { order: order[0] })
  } catch (err) {
    console.log(err);
  }
}
const myOrders = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user._id)
    const order = await orderModel.find({ userId: mongoose.Types.ObjectId(req.session.user._id) }).populate("userId").sort({ createdAt: -1 })
    res.render('user/myorders', { user, order })
  } catch (err) {
    console.log(err);
  }
}

const dowloadInvoice = (req, res) => {
  res.download(`./public/invoice/${req.params.id}.pdf`, 'Invoice.pdf')
}


const cancelOrder = async (req, res) => {
  try {
    const id = req.params.id
    await orderModel.findOneAndUpdate({ _id: id }, {
      $set: {
        isCancelled: true
      }
    })
    return res.json({
      successStatus: true,
      redirect: '/orders/' + id
    })
  } catch (err) {

    console.log(err);
  }
}
const getAccount = async (req, res) => {
  try {

    const user = await userModel.findById(req.session.user._id)
    res.render('user/userDetails', { user })
  } catch (err) {
    console.log(err);
  }

}

const getEdituser = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.user._id)
    if (req.session.message) {
      const message = req.session.message;
      req.session.message = "";
      res.render('user/userEdit', { user, message })
    }
    const message = " "
    res.render('user/userEdit', { user, message })

  } catch (err) {
    console.log(err);
  }

}
const editUser = async (req, res) => {
  try {
    req.session.editUser = req.body

    msg.sendotp(req.session.editUser.phone)

    res.redirect('/editUser/otp')

  } catch (err) {
    console.log(err)
  }

}

const userEditOtp = (req, res) => {
  if (req.session.message) {
    const message = req.session.message;
    req.session.message = "";
    res.render('user/editUser-otp', { message })
  } else {
    const message = ""
    res.render('user/editUser-otp', { message })
  }
}

const checkUserotp = async (req, res) => {
  try {
    const existing = await userModel.findById(req.session.user._id)
    const { name, phone, email } = req.session.editUser
    const password = existing.password
    const otp = req.body.otp
    const checking = await msg.check(otp, phone)
    if (checking.status == "approved") {
      await userModel.findByIdAndUpdate(req.session.user._id, {
        $set: {
          name,
          phone,
          email,
          updatedOn: new Date(),
          password
        }
      })
      req.session.editUser = null
      res.redirect("/myAccount")
    } else {
      req.session.message = "Invalid Otp"
      res.redirect('/editUser/otp')
    }
  } catch (err) {
    res.redirect('myAccount')
    console.log(err);
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

const getLogout = (req, res) => {
  req.session.user = null;
  req.session.viewproducts
  res.redirect("/")
}

module.exports = {
  getHome,
  getAbout,
  getLandingPage,
  getLogout,
  getProducts,
  productSingleview,
  getAddress,
  addAddress,
  orderDetails,
  getAccount,
  cancelOrder,
  myOrders,
  dowloadInvoice,
  getEdituser,
  editUser,
  userEditOtp,
  checkUserotp,
  deleteAdddress,
  editAdddress,
  geteditAdddress,
  getNewaddress,
  filter
}
const orderModel = require('../Models/orderSchema')
const userModel = require('../Models/userSchema')
const productModel = require('../Models/productSchema')
const couponModel = require('../Models/couponSchema')
const mongoose = require('mongoose')
const paypal = require("@paypal/checkout-server-sdk")
const Razorpay = require('razorpay');

let clientId = process.env.CLIENTID;
let clientSecret = process.env.CLIENTSECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

let instance = new Razorpay({
  key_id:process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET,
});

const razorpaySuccess=async(req,res)=>{
  try {
    const user = await userModel.findById(req.session.user._id).populate('cart.productId')
    const couponId=req.session.discount
    let userAddress = []
    user.shippingAddress.forEach(item => {
      if (req.session.address == item._id)
        userAddress.push(item)
    })

    const order = new orderModel({
      userId: req.session.user._id,
      userAddress,
      phone: user.phone,
      totalAmount: user.cartTotal + 50,
      paymentMethod: 'RAZORPAY',
      paymentVerified: true,
      couponId
    })

    user.cart.forEach(item => {
      const items = {
        productId: item.productId._id,
        productName: item.productId.productName,
        colour: item.productId.colour,
        quantity: item.quantity,
        price: item.productId.price,
        image: item.productId.images[0]
      }
      order.items.push(items)
    })

    for (let item of user.cart) {
      await productModel.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(item.productId._id)
      },
        {
          $inc: {
            totalStock: -item.quantity,
          }
        }),
        await userModel.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(user._id)
        }, {
          $inc: {
            totalSpent: user.cartTotal + 50,
            totalOrders: 1,
          }
        })
    }

    await order.save()
    await userModel.findOneAndUpdate({
      _id: req.session.user._id
    },
      {
        $set: {
          cart: [],
          cartTotal: 0
        }
      })

    await couponModel.findByIdAndUpdate(req.session.discount,{$push:{
      users:req.session.user._id
    }})
      req.session.discount=null
    req.session.order = true
    return res.redirect('/orderSuccess')
  } catch (error) {
    console.log(error)
    return res.redirect('/orderFailed')
  }
}


const razorPay=async(req,res)=>{
  try{
    if(!req.body.address){
      req.session.message = 'Please select an address'
      res.json({successStatus:false,
        redirect:'/checkout'})
    }else{
      req.session.address=req.body.address
const coupon=req.session.discount
  const user = await userModel.findById(req.session.user._id).populate('cart.productId')
  console.log(user);
  let total
if(coupon?.isPercentage){
   total = (user.cartTotal+50 - user.cartTotal * coupon.discount/100 )*100
}else if(coupon?.discount){
   total = (user.cartTotal +50-coupon.discount)*100
}else{
   total = (user.cartTotal+50)*100
}
let options = {
  amount: total,
  currency: "INR",
  receipt:'order12'
}
instance.orders.create(options, function(err, order) {
  console.log(order);
res.json({successStatus:true, orders:order})
})
    }
  }catch(err){
console.log(err)
  }
  
}

const cashOndelivery = async (req, res) => {
    if(!req.body.address){
      req.session.message = 'Please add an address'
      res.redirect('/checkout')
    }else{
      try {
      const user = await userModel.findById(req.session.user._id).populate('cart.productId')
  const couponId=req.session.discount
      let userAddress = []
      user.shippingAddress.forEach(item => {
        if (req.body.address == item._id)
          userAddress.push(item)
      })
  
      const order = new orderModel({
        userId: req.session.user._id,
        userAddress,
        phone: user.phone,
        totalAmount: user.cartTotal + 50,
        paymentMethod: 'COD',
        paymentVerified: true,
        couponId
      })
  
      user.cart.forEach(item => {
        const items = {
          productId: item.productId._id,
          productName: item.productId.productName,
          colour: item.productId.colour,
          quantity: item.quantity,
          price: item.productId.price,
          image: item.productId.images[0]
        }
        order.items.push(items)
      })
  
      for (let item of user.cart) {
        await productModel.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(item.productId._id)
        },
          {
            $inc: {
              totalStock: -item.quantity,
            }
          }),
          await userModel.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(user._id)
          }, {
            $inc: {
              totalSpent: user.cartTotal + 50,
              totalOrders: 1,
            }
          })
      }
  
      await order.save()
      await userModel.findOneAndUpdate({
        _id: req.session.user._id
      },
        {
          $set: {
            cart: [],
            cartTotal: 0
          }
        })
        await couponModel.findByIdAndUpdate(req.session.discount,{$push:{
          users:req.session.user._id
        }})
        req.session.discount=null
      req.session.order = true
      return res.redirect('/orderSuccess')
    } catch (error) {
      console.log(error)
      return res.redirect('/orderFailed')
    }
    }
    
  }
  
  const ordersuccess = (req, res) => {
    res.render('user/ordersuccess')
  }
  
  const orderFailed = (req, res) => {
    res.render('user/orderFailed')
  }
  
  const paymentPaypal = async (req, res) => {
    if(!req.body.address){
      req.session.message = 'Please select an address'
      res.json({redirect:'/checkout'})
    }else{
      req.session.address=req.body.address
      const coupon=req.session.discount
    const request = new paypal.orders.OrdersCreateRequest()
    const user = await userModel.findById(req.session.user._id).populate('cart.productId')
    console.log(user);
    let total
  if(coupon?.isPercentage){
     total = user.cartTotal+50 - user.cartTotal * coupon.discount/100
  }else if(coupon?.discount){
     total = user.cartTotal +50-coupon.discount
  }else{
     total = user.cartTotal+50
  }
    
    console.log(total);
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total,
              },
            },
          },
    
        },
      ],
    })
  
    try {
      const order = await client.execute(request)
      console.log(order.result);
      
      res.json({id: order.result.id})
  
      console.log(`Order: ${(order.result)}`);
  
    } catch (err) {
      console.log(err);
    }
    }
  
  }
  
  const paypalSuccess = async (req, res) => {
    try {
      const user = await userModel.findById(req.session.user._id).populate('cart.productId')
      const couponId=req.session.discount
      let userAddress = []
      user.shippingAddress.forEach(item => {
        if (req.session.address == item._id)
          userAddress.push(item)
      })
  
      const order = new orderModel({
        userId: req.session.user._id,
        userAddress,
        phone: user.phone,
        totalAmount: user.cartTotal + 50,
        paymentMethod: 'PAYPAL',
        paymentVerified: true,
        couponId
      })
  
      user.cart.forEach(item => {
        const items = {
          productId: item.productId._id,
          productName: item.productId.productName,
          colour: item.productId.colour,
          quantity: item.quantity,
          price: item.productId.price,
          image: item.productId.images[0]
        }
        order.items.push(items)
      })
  
      for (let item of user.cart) {
        await productModel.findOneAndUpdate({
          _id: mongoose.Types.ObjectId(item.productId._id)
        },
          {
            $inc: {
              totalStock: -item.quantity,
            }
          }),
          await userModel.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(user._id)
          }, {
            $inc: {
              totalSpent: user.cartTotal + 50,
              totalOrders: 1,
            }
          })
      }
  
      await order.save()
      await userModel.findOneAndUpdate({
        _id: req.session.user._id
      },
        {
          $set: {
            cart: [],
            cartTotal: 0
          }
        })
  
      await couponModel.findByIdAndUpdate(req.session.discount,{$push:{
        users:req.session.user._id
      }})
        req.session.discount=null
      req.session.order = true
      return res.redirect('/orderSuccess')
    } catch (error) {
      console.log(error)
      return res.redirect('/orderFailed')
    }
  }
  
  module.exports = {
    cashOndelivery,
    orderFailed,
    ordersuccess,
    paymentPaypal,
    paypalSuccess,
    razorPay,
    razorpaySuccess
  }
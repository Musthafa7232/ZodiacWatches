const userModel = require('../Models/userSchema')
const couponModel = require('../Models/couponSchema')
const mongoose = require('mongoose')
const orderModel = require('../Models/orderSchema')

const getCheckout = async (req, res) => {
  try{
    let discount={}
    if(req.session.discount){
      discount=req.session.discount
    }
 const address = await userModel.findById(req.session.user._id) .populate('cart.productId')
 
 const coupons=await couponModel.aggregate([
  {
    '$match': {
      'isDeleted': false, 
      'users': {
        '$nin': [
           mongoose.Types.ObjectId(req.session.user._id)
        ] 
      },
        'expiry': { $gt : new Date()} 
    }
  }
])



 
  if(req.session.message){
    const message=req.session.message
    req.session.message=""
    
  res.render('user/checkout', { address,message,coupons,discount})
  }else{
    const message=""
  res.render('user/checkout', { address,message ,coupons,discount})
  } 
  }catch(err){
    console.log(err);
  }
  
}

const applyCoupon=async(req,res)=>{
try{
const id=req.params.id

const discount=await couponModel.findById(id)

req.session.discount=discount
res.json({
  successStatus:true,
  redirect:'/checkout'
})
}catch(err){
  console.log(err);
}
}

const returnProduct=async(req,res)=>{
  try{
const id=req.params.id

await orderModel.findByIdAndUpdate(id,{$set:{
  return:true,
  returnStatus:'Requested'
}})

return res.json({
  successStatus:true,
  redirect:'/orders/'+id
})
  }catch(err){
    console.log(err)
  }
}



module.exports = {
  getCheckout,
  applyCoupon,
  returnProduct,
 
}

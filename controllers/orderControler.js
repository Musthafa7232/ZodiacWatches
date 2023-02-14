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
 console.log(address)
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


console.log(coupons)
 
  if(req.session.message){
    const message=req.session.message
    req.session.message=""
     console.log(address);
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
console.log(id+'hi');
const discount=await couponModel.findById(id)

console.log(discount);
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

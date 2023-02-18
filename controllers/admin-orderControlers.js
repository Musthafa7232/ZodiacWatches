const userModel = require('../Models/userSchema')
const orderModel = require('../Models/orderSchema')
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const xlsx = require('xlsx')
const orders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("userId").sort({ createdAt: -1 })
    res.render('admin/orders/orders', { orders,dashboard:false,product:false,user:false,returns:false,categorys:false,coupons:false,banner:false,order:true,sale:false  })
  } catch (err) {
    console.log(err);
  }
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
      redirect: '/admin/orders'
    })
  } catch (err) {

    console.log(err);
  }


}
const saveChanges = async (req, res) => {
  try {
    const id = req.params.id

    await orderModel.findOneAndUpdate({ _id: id }, {
      $set: {
        orderStatus: req.body.orderStatus
      }
    })
    return res.json({
      successStatus: true,
      redirect: '/admin/orders'
    })
  } catch (err) {

    console.log(err);
  }


}
const getReturn = async (req, res) => {
  try {
    const orders = await orderModel.find({ return: true }).sort({createdAt:-1})
   
    res.render('admin/return/return', { orders,dashboard:false,product:false,user:false,returns:true,categorys:false,coupons:false,banner:false,order:false,sale:false })

  } catch (err) {
    console.log(err);
  }
}
const salesReport=async (req,res)=>{
  try{
let sales=[]
  if(req.session.from && req.session.to){
    const from=req.session.from
    const to=req.session.to
  
  
    sales = await orderModel.aggregate([
      {
        $match: {
          'isCancelled':false,
                  $and: [
                    { 'createdAt': { $gte: new Date(from) } },
                    { 'createdAt': { $lte: new Date(to) } },
                  ],
        }
      },
      {
        $sort: {
          createdAt:1,
        }

      }
    ])
   req.session.fromm = req.session.from
   req.session.too =req.session.to
     req.session.from=null
     req.session.to=null
    
  }
 
  res.render('admin/salesReport/sales', { orders,dashboard:false,product:false,user:false,returns:false,categorys:false,coupons:false,banner:false,order:false,sale:true,sales})

  }catch(err){
    console.log(err);
  }
  
}

const dateFilter=(req,res)=>{
  req.session.from=req.body.from 
  req.session.to=req.body.to
  

  
  res.redirect('/admin/sales')
}

const filteredExcel = async (req, res) => {
  try {
    const from=req.session.fromm
    const to=req.session.too
    const orders = await orderModel.aggregate([
      {
        '$match': {
          'isCancelled': false, 
          $and: [
            { 'createdAt': { $gte: new Date(from) } },
            { 'createdAt': { $lte: new Date(to) } },
          ],
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'userId',
          'foreignField': '_id',
          'as': 'userDetails'
        }
      }, {
        '$unwind': '$userDetails'
      }, {
        '$unwind': '$userAddress'
      }, {
        '$unwind': '$items'
      }, {
        '$project': {
          'userAddress': 1,
          'phone': 1,
          'totalAmount': 1,
          'paymentMethod': 1,
          'orderStatus': 1,
          'items': 1,
          'createdAt': 1,
          "userDetails": 1
        }
      }, {
        '$sort': {
          'createdAt': 1
        }
      }
    ])
 

    let fields = []
    orders.forEach(items => {
      const item =
      {
       
        orderedOn: items.createdAt.toString().slice(0, 16),
        name: items.userDetails.name,
        email: items.userDetails.email,
        phone: items.userDetails.phone,
        products: items.items.productName,
        quantity: items.items.quantity,
        colour: items.items.colour,
        totalAmount:items.totalAmount,
        paymentMethod: items.paymentMethod,
        orderedStatus: items.orderStatus
      }
      fields.push(item)
    })
    

    let newWb = xlsx.utils.book_new()
    let newWs = xlsx.utils.json_to_sheet(fields)
    xlsx.utils.book_append_sheet(newWb, newWs, 'data')

    xlsx.writeFile(newWb, "./public/files/data.xlsx")
    res.download('./public/files/data.xlsx', 'Sales Report.xlsx')

  } catch (error) {
    console.log(error)

  }
}
const cancelReturn = async (req, res) => {
  try {
    const id = req.params.id
    await orderModel.findByIdAndUpdate(id, {
      $set: {
        return: true,
        returnStatus: 'Declined'
      }
    })
    res.json({
      successStatus:true,
      redirect:'/admin/returns'
    })
  } catch (err) {
    console.log(err)
  }


}

const approveReturn = async (req, res) => {
  try {
    const id = req.params.id
    await orderModel.findByIdAndUpdate(id, {
      $set: {
        return: true,
        returnStatus: 'Approved'
      }
    })
    res.json({
      successStatus:true,
      redirect:'/admin/returns'
    })
  } catch (err) {
    console.log(err)
  }

}


const saveReturnStatus = async (req, res) => {
  try {
    const id = req.params.id
    
    if(req.body.returnStatus==='Refund Initiated'){

const order=await orderModel.findById(id)

await userModel.findOneAndUpdate({ _id: order.userId }, {
  $inc: {
wallet:order.totalAmount
  },
})
await userModel.findOneAndUpdate({ _id:order.userId }, { $push: { walletStatus: {
  history:"Credited",
  amount:order.totalAmount,
  createdOn: Date(),
} } })

    }
      await orderModel.findOneAndUpdate({ _id: id }, {
      $set: {
        returnStatus: req.body.returnStatus
      }
    })
    return res.json({
      successStatus: true,
      redirect: '/admin/returns'
    })
    
    
      
    
  } catch (err) {

    console.log(err);
  }


}


module.exports = {
  orders,
  cancelOrder,
  saveChanges,
  getReturn,
  cancelOrder,
  approveReturn,
  cancelReturn,
  saveReturnStatus,
  salesReport,
  dateFilter,
  filteredExcel
}
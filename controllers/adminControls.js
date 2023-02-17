const adminModel = require('../Models/adminSchema');
const orderModel = require('../Models/orderSchema')
const productModel = require('../Models/productSchema')
const userModel = require('../Models/userSchema')
const xlsx = require('xlsx')
const fs = require('fs')

const getLogin = (req, res) => {
  if (req.session.message) {
    const message = req.session.message;
    req.session.message = "";
    return res.render("admin/login", { message })
  }
  const message = ""
  return res.render("admin/login", { message })
}
const login = async (req, res) => {
  try {
    const admin = await adminModel.find({ email: req.body.email, password: req.body.password })
    if (admin.length == 0) {
      req.session.message = "invalid email"
      return res.redirect('/admin')
    } else {
      req.session.admin = admin;
      return res.redirect('/admin/home')
    }
  } catch (err) {
    console.log(err);
  }
}
const gethome = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        '$match': {
          'isDeleted': false
        }
      }, {
        '$count': 'total'
      }
    ])
    const users = await userModel.aggregate([
      {
        '$match': {
          'isBlocked': false
        }
      }, {
        '$count': 'total'
      }
    ])
    const orders = await orderModel.aggregate([
      {
        '$match': {
          'isCancelled': false
        }
      }, {
        '$count': 'total'
      }
    ])
    const totalIncome = await orderModel.aggregate([
      {
        '$match': {
          'isCancelled': false
        }
      }, {
        '$group': {
          '_id': {
            '$year': '$createdAt'
          },
          'totalSpent': {
            '$sum': '$totalAmount'
          }
        }
      }])

    return res.render("admin/home", { products, users, orders, totalIncome,dashboard:true,product:false,user:false,returns:false,categorys:false,coupons:false,banner:false,order:false,sale:false })
  } catch (err) {
    console.log(err);
  }

}

const getDashboard = async (req, res) => {
  try {
    const orders = await orderModel.aggregate([
      {
        '$unwind': {
          'path': '$items'
        }
      }, {
        '$match': {
          'isCancelled': false
        }
      }, {
        '$group': {
          '_id': {
            '$dayOfYear': '$createdAt'
          },
          'date': {
            '$first': '$createdAt'
          },
          'totalSpent': {
            '$sum': '$totalAmount'
          }
        }
      }, {
        '$sort': {
          'date': 1
        }
      }])

    res.json({ orders })
  } catch (err) {
    console.log(err);
  }
}

const getproducts=async(req,res)=>{
try{
const products=await orderModel.aggregate([
  {
    '$unwind': {
      'path': '$items'
    }
  },{
    $addFields: {
      currMonth: {
        '$month' : new Date()
      },
      docMonth: {
        '$month': '$createdAt'
      }
    }
  }, {
    '$match': {
      'isCancelled': false,
      $expr: {
        $eq: ['$currMonth', '$docMonth']
      }
    }
  },
  {
    $group: {
      _id: '$items.productId',
      product: {$first: '$items.productName'},
      quantity: {$sum: '$items.quantity'}
    }
  }
])

res.json({ products })
}catch(err){
console.log(err);
}
}

const downloadExcel = async (req, res) => {
  try {
  
    const orders = await orderModel.aggregate([
    {
        '$addFields': {
          currMonth: {
            '$month' : new Date()
          },
          docMonth: {
            '$month': '$createdAt'
          }
        }
      },
      {
        $match: {
          isCancelled: false,
          $expr: {
            $eq: ['$currMonth', '$docMonth']
          }
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
          'createdAt': -1
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
const SalesReport = (req, res) => {
  res.download('./public/files/salesReport.pdf', 'Sale Report.pdf')
}

const getLogout = (req, res) => {
  req.session.admin = null;
  res.redirect('/admin')
}


module.exports = {
  getLogin,
  gethome,
  login,
  getLogout,
  getDashboard,
  downloadExcel,
  SalesReport,
  getproducts
}

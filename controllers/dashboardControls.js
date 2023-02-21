const orderModel = require('../Models/orderSchema')
const mongoose = require('mongoose')
const msg = require("../utils/Twilio");
const userModel = require('../Models/userSchema')

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
        const order =await orderModel.findById(id)
        if(order.paymentMethod=="RAZORPAY"||order.paymentMethod=="PAYPAL"||order.paymentMethod=="Wallet"){
            await userModel.findOneAndUpdate({ _id: order.userId }, {
                $inc: {
              wallet:order.totalAmount
                },
              })
            await userModel.findOneAndUpdate({ _id:req.session.user._id }, { $push: { walletStatus: {
                history:"Credited",
                amount:order.totalAmount,
                createdOn: Date(),
              } } })
        }
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
const myWallet=async(req,res)=>{
    try{
        const user = await userModel.findById(req.session.user._id)
    res.render('user/myWallet',{user})
    }catch(err){
console.log(err);
    }

}
module.exports = {
    cancelOrder,
    orderDetails,
    myOrders,
    dowloadInvoice,
    getAccount,
    getEdituser,
    editUser,
    userEditOtp,
    checkUserotp,
myWallet
}
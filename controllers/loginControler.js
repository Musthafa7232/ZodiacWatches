
const userModel = require('../Models/userSchema')
const msg = require("../utils/Twilio")
const bcrypt = require('bcrypt')

const getLogin = (req, res) => {
    if (req.session.message) {
        const message = req.session.message;
        const user = req.session.loginEmail;
        req.session.message = "";
        req.session.loginEmail = ""
        return res.render("user/login-signup/login", { message, user })
    }
    const message = ""
    const user = ""
    return res.render("user/login-signup/login", { message, user })
}

const login = async (req, res) => {
    try {
        if(!req.body.email){
            req.session.message="Enter an email address"
            res.redirect('/login')
        }else{
                 const user = await userModel.find({ email: req.body.email })
        if (user.length == 0) {
            req.session.message = "User does not exist"
            res.redirect('/login')
        } else {
            const match = await bcrypt.compare(req.body.password, user[0].password)
            if (!match) {
                req.session.loginEmail = user[0].email;
                req.session.message = "Invalid password"
                return res.redirect('/login')
            }
            else if (user[0].isBlocked) {
                req.session.message = "You Are Blocked "
                return res.redirect('/login')
            } else {
                req.session.user = user[0];
                
                return res.redirect('/home')
            }
        }
        }
   
    } catch (err) {
        console.log(err);
    }

}
const getForgetpass = async (req, res) => {
    try {
        console.log(req.body.email)
        if (!req.body.email) {
            req.session.message = "enter an email address to verify your account"
            res.json({
                successStatus: false,
                redirect: 'login'
            })
        }
        else {
            const user = await userModel.find({ email: req.body.email })

            if (user.length == 0) {
                req.session.message = "User does not exist"
                res.json({
                    successStatus: false,
                    redirect: 'login'
                })
            } else {
                req.session.forgotPass = user[0]
                msg.sendotp(user[0].phone)
                res.json({
                    successStatus: true,
                    redirect: '/forgotPass/otp'
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}
const passwordOtp = (req, res) => {
    if (req.session.message) {
        const message = req.session.message;
        req.session.message = "";
        res.render('user/login-signup/forgotPass', { message })
    } else {
        const message = ""
        res.render('user/login-signup/forgotPass', { message })
    }
}

const forgotPassotp = async (req, res) => {
    try {
        const otp = req.body.otp
        const checking = await msg.check(otp, req.session.forgotPass.phone)
        if (checking.status == "approved") {
            res.redirect("/changePassword")
        } else {
            req.session.message = "You have entered an Invalid Otp"
            res.redirect('/forgotPass/otp')
        }
    } catch (err) {
        req.session.message = "You have entered an Invalid Otp"
        res.redirect('/forgotPass/otp')
        console.log(err);
    }
}

const changePassword = (req, res) => {
    if (req.session.message) {
        const message = req.session.message;
        req.session.message = "";
        res.render('user/login-signup/changePass', { message })
    } else {
        const message = ""
        res.render('user/login-signup/changePass', { message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, Confirmpassword } = req.body
        
        if (Confirmpassword != password) {
            req.session.message = "password do not match"
            res.redirect('/changePassword')
        } else if (!password) {
            req.session.message = "enter a password"
            res.redirect('/changePassword')
        } else {
            const user = await userModel.findById(req.session.forgotPass._id,)
            user.password = password
            await user.save()
            req.session.forgotPass = null
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}
const getRegister = (req, res) => {
    req.session.newUser = null
    if (req.session.message) {
        const message = req.session.message;
        const register = req.session.register
        req.session.message = "";
        return res.render("user/login-signup/register", { message, register })
    } else {
        const message = ""
        const register = ""
        return res.render("user/login-signup/register", { message, register })
    }

}



const register = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const existing = await userModel.find({ email })
        const existingPhone = await userModel.find({ phone })
        const user = new userModel({
            name,
            phone,
            email,
            password,
            createdOn: Date(),
            updatedOn: Date()
        })
        req.session.newUser = user;
        if (existingPhone.length != 0) {
            req.session.message = "Phone Number already exists"
            return res.redirect('/register')
        } else if (existing.length == 0) {
            try {
                msg.sendotp(req.session.newUser.phone)
                return res.redirect('/register/otp')
            } catch (err) {
                console.log(err)
            }
        } else {
            req.session.message = "Email already exists"
            return res.redirect('/register')
        }
    } catch (error) {
        console.log(error)
    }
}

const getotp = (req, res) => {
    if (req.session.message) {
        const message = req.session.message;
        req.session.message = "";
        res.render('user/login-signup/otp', { message })
    } else {
        const message = ""
        res.render('user/login-signup/otp', { message })
    }
}

const checkotp = async (req, res) => {

    try {
        const { name, phone, email, password, createdOn, updatedOn } = req.session.newUser
        const user = new userModel({
            name,
            phone,
            email,
            password,
            createdOn,
            updatedOn
        })
        const otp = req.body.otp
        const checking = await msg.check(otp, user.phone)
        if (checking.status == "approved") {
            await user.save()
            req.session.newUser = null
            req.session.user = user
            res.redirect("/home")
        } else {
            req.session.message = "Invalid Otp"
            res.redirect('/register/otp')
        }
    } catch (err) {
        console.log(err);
    }
}

const resendOtp = async (req, res) => {
    try {
        msg.sendotp(req.session.newUser.phone)
        return res.redirect('/register/otp')
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLogin,
    login,
    getForgetpass,
    getRegister,
    getotp,
    checkotp,
    resendOtp,
    register,
    forgotPassotp,
    passwordOtp,
    changePassword,
    resetPassword
}
const userModel = require('../Models/user')
const msg = require("../utils/Twilio")
module.exports = {

    getLandingPage: (req, res) => {
        return res.render("user/landing-page")
    },

    getLogin: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            return res.render("user/login-signup/login", { message })
        }
        const message = " "
        return res.render("user/login-signup/login", { message })
    },

    getHome: (req, res) => {
        return res.render("user/home")
    },

    getRegister: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            return res.render("user/login-signup/register", { message })
        }
        const message = " "
        return res.render("user/login-signup/register", { message })
    },

    Register: async (req, res) => {
        try {
            const { fname, lname, phone, email, password } = req.body;
            const existing = await userModel.find({ email })
            const user = new userModel({
                fname,
                lname,
                phone,
                email,
                password
            })
            req.session.newUser = user;
            if (existing.length == 0) {
                if (req.body['confirm-password'] != password) {
                    req.session.message = "Password do not match"
                    return res.redirect('/register')
                } else if (!(phone).match(/^[789]\d{9}$/)) {
                    req.session.message = "Invalid mobile number"
                    return res.redirect('/register')
                } else {
                    await msg.sendotp(req.session.newUser.phone)
                    return res.redirect('/register/otp')
                }
            } else {
                req.session.message = "User already exists"
                return res.redirect('/register')
            }
        } catch (err) {
            console.log(err)
        }

    },

    getotp: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            res.render('user/login-signup/otp', { message })
        } else {
            const message = ""
            res.render('user/login-signup/otp', { message })
        }
    },

    checkotp: async (req, res) => {
        try {
            const{fname,lname,phone,email,password}=req.session.newUser
            const user = new userModel({
                fname,
                lname,
                phone,
                email,
                password
            })
            const otp = req.body.otp
            const checking = await msg.check(otp, user.phone)
            if (checking.status == "approved") {
                await user.save()
                req.session.newUser = null
                res.redirect("/login")
            } else {
                req.session.message = "Invalid Otp"
                res.redirect('/register/otp')
            }
        } catch (err) {
            console.log(err);
        }

    },

    Login: async (req, res) => {
        try {
            const user = await userModel.find({ email: req.body.email })
            if (user.length == 0) {
                req.session.message = "User does not exist"
                return res.redirect('/login')
            } else if (req.body.password != user[0].password) {
                req.session.message = "Password is incorrect"
                return res.redirect('/login')
            } else {
                req.session.user = true;
                return res.redirect('/home')
            }
        } catch (err) {
            console.log(err);
        }

    },

    getLogout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    }

}
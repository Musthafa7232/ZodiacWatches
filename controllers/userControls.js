const userModel = require('../Models/userSchema')
const msg = require("../utils/Twilio")
const upload = require('../utils/fileUploads')
const bcrypt = require('bcrypt')


module.exports = {

    getLandingPage: (req, res) => {
        return res.render("user/landing-page")
    },
    getHome: (req, res) => {
        const user = req.session.user
        return res.render("user/home", { user })
    },

    getLogin: (req, res) => {
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
    },

    login: async (req, res) => {
        try {
            const user = await userModel.find({ email: req.body.email })
            const match = await bcrypt.compare(req.body.password, user[0].password)
            if (user.length == 0) {
                req.session.message = "User does not exist"
                return res.redirect('/login')
            }
            else if (!match) {
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
        } catch (err) {
            console.log(err);
        }

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

    register: async (req, res) => {
        try {
            const { fname, lname, phone, email, password } = req.body;
            const existing = await userModel.find({ email })
            const existingPhone = await userModel.find({ phone })
            const user = ({
                fname,
                lname,
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
                    await msg.sendotp(req.session.newUser.phone)
                    return res.redirect('/register/otp')
                } catch (err) {
                    console.log(err)
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
            const { fname, lname, phone, email, password, createdOn, updatedOn } = req.session.newUser
            const user = new userModel({
                fname,
                lname,
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
                res.redirect("/login")
            } else {
                req.session.message = "Invalid Otp"
                res.redirect('/register/otp')
            }
        } catch (err) {
            console.log(err);
        }
    },

    resendOtp: async (req, res) => {
        try {
            await msg.sendotp(req.session.newUser.phone)
            return res.redirect('/register/otp')
        } catch (err) {
            console.log(err);
        }
    },

    getLogout: (req, res) => {
        req.session.user = null;
        res.redirect("/")
    }

}
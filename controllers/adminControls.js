const session = require('express-session');
const adminModel = require('../Models/adminSchema');
const { find } = require('../Models/userSchema');
const userModel = require('../Models/userSchema')

module.exports = {
    getLogin: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            return res.render("admin/login", { message })
        }
        const message = " "
        return res.render("admin/login", { message })
    },

    gethome: (req, res) => {
        return res.render("admin/home")
    },

    getproducts: (req, res) => {
        return res.render("admin/products/products")
    },

    getUser: async (req, res) => {
        try {
            const users = await userModel.find()
            return res.render("admin/users/users", { users })
        } catch (err) {
            console.log(err);
        }
    },

    getCategory: (req, res) => {
        return res.render("admin/category/category")
    },

    addCategory: (req, res) => {
        if (req.session.message) {
            res.redirect('/admin/category')
        } else {
            res.redirect('/admin/category')
        }
    },


    blockUser: async (req, res) => {
        try {
            const id = req.params.id
            const user = await userModel.findById(id)
            if (user.isBlocked) {
                try {
                    await userModel.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: false
                        }
                    })
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                } catch (error) {
                    console.log(error)
                    return res.json({
                        successStatus: false
                    })
                }
            } else {
                try {
                    await userModel.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: true
                        }
                    })
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                } catch (error) {
                    console.log(error)
                    return res.json({
                        successStatus: false
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    },

    viewUser: async (req, res) => {
        try {
            const id = req.params.id
            const user = await userModel.findById(id)
            console.log(user)
            res.render('admin/users/viewUser', {user})
        } catch (err) {
            console.log(err);
        }
    },

    Login: async (req, res) => {
        const admin = await adminModel.find({ email: req.body.email, password: req.body.password })
        console.log(admin)
        if (admin.length == 0) {
            req.session.Errmessage = "User does not exist"
            return res.redirect('/admin')
        } else {
            req.session.admin = admin;
            return res.redirect('/admin/home')
        }
    },

}

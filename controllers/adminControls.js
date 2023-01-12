const adminModel = require('../Models/admin')
const userModel = require('../Models/user')

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

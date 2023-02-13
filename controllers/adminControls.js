const session = require('express-session');
const adminModel = require('../Models/adminSchema');
const categoryModel = require('../Models/categorySchema');
const userModel = require('../Models/userSchema')
const productModel = require('../Models/productSchema')
const upload = require('../utils/cloudinary')
const bannerModel = require('../Models/bannerSchema')
module.exports = {

    //Admin Login
    getLogin: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            return res.render("admin/login", { message })
        }
        const message = " "
        return res.render("admin/login", { message })
    },
    Login: async (req, res) => {
        try {
            const admin = await adminModel.find({ email: req.body.email, password: req.body.password })
            if (admin.length == 0) {
                req.session.Errmessage = "User does not exist"
                return res.redirect('/admin')
            } else {
                req.session.admin = admin;
                return res.redirect('/admin/home')
            }
        } catch (err) {
            console.log(err);
        }
    },
    gethome: (req, res) => {
        return res.render("admin/home")
    },

    //Product Management
    getproducts: async (req, res) => {
        try {
            const products = await productModel.find({ isDeleted: false }).populate('categoryId')
            return res.render("admin/products/products", { products })
        } catch (err) {
            console.log(err);
        }

    },

    newProducts: async (req, res) => {
        try {
            const category = await categoryModel.find({ isDeleted: false })
            return res.render('admin/products/addproducts', { category })
        } catch (err) {
            console.log(err);
        }

    },

    addProducts: async (req, res) => {
        try {
            const { productName, brand, highlights, specifications, categoryId, price, colour, totalStock } = req.body
            const images = [];
            for (key in req.files) {
                const paths = req.files[key][0].path
                console.log(paths)
                images.push(paths.slice(7));
            }

            const newProduct = new productModel({
                productName,
                brand,
                highlights,
                categoryId,
                price,
                colour,
                totalStock,
                specifications,
                images
            })
            await newProduct.save()
            console.log('Product Added')
            res.redirect('/admin/products')
        } catch (err) {
            console.log(err);
        }
    },

    viewProducts: async (req, res) => {
        const id = req.params.id
        const product = await productModel.findById(id)
        const category = await categoryModel.find({ isDeleted: false })
        res.render('admin/products/editProducts', { category, product })
    },

    editProducts: async (req, res) => {
        try {
            const { productName, brand, highlights, specifications, colour, price, categoryId, totalStock } = req.body
            const id = req.params.id
            console.log('hello')
            await productModel.findOneAndUpdate({ _id: id }, {
                productName,
                brand,
                highlights,
                categoryId,
                price,
                colour,
                totalStock,
                specifications
            }, {
                new: true,
                upsert: true,
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/products'
            })
        } catch (err) {
            console.log(err)
        }
    },

    deleteProducts: async (req, res) => {
        try {
            console.log("heyy")
            const id = req.params.id
            await productModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    isDeleted: true
                }
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/products'
            })
        } catch (err) {
            console.log(err);
        }
    },




    // Category Management
    getCategory: async (req, res) => {
        try {
            const category = await categoryModel.find({ isDeleted: false })
            if (req.session.message) {
                const message = req.session.message;
                req.session.message = ""
                return res.render("admin/category/category", { category, message })
            } else {
                const message = ""
                return res.render("admin/category/category", { category, message })
            }
        } catch (err) {
            console.log(err);
        }

    },

    addCategory: async (req, res) => {
        try {
            const category = new categoryModel({
                categoryName: req.body.category
            })
            const existing = await categoryModel.find({ categoryName: req.body.category, isDeleted: false })
            if (existing.length === 0) {
                try {
                    await category.save()
                    res.redirect('/admin/category')
                } catch (error) {
                    req.session.message = error.errors.categoryName.properties.message
                    res.redirect('/admin/category')
                }
            } else {
                req.session.message = "This category already exists please Add a new category "
                res.redirect('/admin/category')
            }
        } catch (err) {
            console.log(err);
        }

    },

    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id
            await categoryModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    isDeleted: true
                }
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/category'
            })
        } catch (err) {
            console.log(err);
        }
    },

    //User Management
    getUser: async (req, res) => {
        try {
            const users = await userModel.find()
            return res.render("admin/users/users", { users })
        } catch (err) {
            console.log(err);
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

    viewUser: (req, res) => {
        try {
            const id = req.params.id
            userModel.findById(id, function (err, docs) {
                if (err) {
                    console.log(err);
                }
                else {
                    const users = docs
                    res.render('admin/users/viewUser', { users })
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    //Banner Management
    getBanner: async (req, res) => {
        const banners = await bannerModel.find({ isDeleted: false })
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = ""
            res.render('admin/banners/banners', { banners, message })
        } else {
            const message = ""
            res.render('admin/banners/banners', { banners, message })
        }
    },

    addBanner: async (req, res) => {
        try {
            const paths = req.file.path.slice(6)
            console.log(req.body.banner)
            console.log(paths)
            const banner = new bannerModel({
                bannerTitle: req.body.banner,
                images: paths
            })
            const existing = await bannerModel.find({isDeleted: false})
         console.log(existing);   
            if (existing.length == 0) {
                try {
                    console.log("hi");
                    await banner.save()
                    console.log("hi");
                    res.redirect('/admin/banners')
                } catch (error) {
                    console.log(error)
                    res.redirect('/admin/banners')
                }
            } else {
                req.session.message = "This banner already exists please Add a new category "
                res.redirect('/admin/banners')
            }

        } catch (err) {
            console.log(err);
        }
    },

    deleteBanner:async(req,res)=>{
        try {
            const id = req.params.id
            await bannerModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    isDeleted: true
                }
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/banners'
            })
        } catch (err) {
            console.log(err);
        }
    },
    getCoupon: (req, res) => {
        res.render('admin/coupons/coupons')
    },
    getLogout: (req, res) => {
        req.session.admin = null;
        res.redirect('/admin')
    }
}

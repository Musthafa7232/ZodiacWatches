const categoryModel = require('../Models/categorySchema');
const productModel = require('../Models/productSchema')
const mongoose = require('mongoose')
const getCategory = async (req, res) => {
    try {
        const category = await categoryModel.find({ isDeleted: false })
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = ""
            return res.render("admin/category/category", { category,message,dashboard:false,product:false,user:false,returns:false,categorys:true,coupons:false,banner:false,order:false,sale:false  })
        } else {
            const message = ""
            return res.render("admin/category/category", { category,message,dashboard:false,product:false,user:false,returns:false,categorys:true,coupons:false,banner:false,order:false,sale:false  })
        }
    } catch (err) {
        console.log(err);
    }

}

const addCategory = async (req, res) => {
    try {
        const category = new categoryModel({
            categoryName: req.body.category.toUpperCase()
        })
        const existing = await categoryModel.find({ categoryName: req.body.category.toUpperCase(), isDeleted: false })
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

}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        await categoryModel.findOneAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true
            }
        })
        await productModel.updateMany({ categoryId: mongoose.Types.ObjectId(id) }, { $set: { isDeleted: true } })
        return res.json({
            successStatus: true,
            redirect: '/admin/category'
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getCategory,
    addCategory,
    deleteCategory
}
const productModel = require('../Models/productSchema')
const categoryModel = require('../Models/categorySchema');
const fs = require('fs');
const { findById } = require('../Models/userSchema');

const getproducts = async (req, res) => {
    try {
        const products = await productModel.find({ isDeleted: false }).populate('categoryId')
        return res.render("admin/products/products", { products, dashboard: false, product: true, user: false, returns: false, categorys: false, coupons: false, banner: false, order: false ,sale:false })
    } catch (err) {
        console.log(err);
    }

}

const newProducts = async (req, res) => {
    try {
        const category = await categoryModel.find({ isDeleted: false })
        if (req.session.message) {
            const message = req.session.message
            req.session.message = ""
            return res.render('admin/products/addproducts', { category, message, dashboard: false, product: true, user: false, returns: false, categorys: false, coupons: false, banner: false, order: false ,sale:false })
        } else {
            const message = ""
            return res.render('admin/products/addproducts', { category, message, dashboard: false, product: true, user: false, returns: false, categorys: false, coupons: false, banner: false, order: false,sale:false  })
        }


    } catch (err) {
        console.log(err);
    }

}

const addProducts = async (req, res) => {
    try {
        const { productName, brand, discription, highlights, categoryId, price, offer, colour, totalStock } = req.body
        const images = [];
        for (key in req.files) {
            const paths = req.files[key][0].path
            images.push(paths.slice(7));
        }
        let prod

        if (productName === "") {
            req.session.message = "Product name is required"
            res.redirect('/admin/addProducts')
        } else {
            prod = await productModel.find({ productName: productName })


          
            if (prod[0]?.productName == productName) {
                req.session.message = "Product already exists"
                res.redirect('/admin/addProducts')
            }
        }
        
        const newProduct = new productModel({
            productName,
            brand,
            highlights,
            categoryId,
            price,
            offer,
            colour,
            totalStock,
            discription,
            images
        })
        try {
            await newProduct.save()
            res.redirect('/admin/products')
        } catch (error) {
            if (error.errors.brand) {
                req.session.message = error.errors.brand.message
            } else if (error.errors.discription) {
                req.session.message = error.errors.discription.message
            } else if (error.errors.highlights) {
                req.session.message = error.errors.highlights.message
            } else if (error.errors.colour) {
                req.session.message = error.errors.colour.message
            } else if (error.errors.price) {
                req.session.message = error.errors.price.message
            } else if (error.errors.totalStock) {
                req.session.message = error.errors.totalStock.message
            } else if (error.errors.categoryId) {
                req.session.message = "Category cannot be empty"
            }
            res.redirect('/admin/addProducts')
            console.log(error);
        }
    } catch (error) {
        console.log(error);

    }
}

const viewProducts = async (req, res) => {
    const id = req.params.id
    const product = await productModel.findById(id)
    const category = await categoryModel.find({ isDeleted: false })
    res.render('admin/products/editProducts', { category, product, dashboard: false, user: false, returns: false, categorys: false, coupons: false, banner: false, order: false,sale:false  })
}

const editProducts = async (req, res) => {
    try {
        const { productName, brand, discription, highlights, categoryId, price, offer, colour, totalStock } = req.body
        const id = req.params.id
        const product = await productModel.findById(id)
        const images = product.images
        if (req.files.image1) {
            const paths = req.files.image1[0].path
            images.splice(0, 1, paths.slice(7))
        }
        if (req.files.image2) {
            const paths = req.files.image2[0].path
            images.splice(1, 1, paths.slice(7))
        }
        if (req.files.image3) {
            const paths = req.files.image3[0].path
            images.splice(2, 1, paths.slice(7))
        } 
        await productModel.findOneAndUpdate({ _id: id }, {
            $set: {
                productName,
                brand,
                highlights,
                categoryId,
                price,
                offer,
                colour,
                totalStock,
                discription,
                images
            }
        }, {
            new: true,
            upsert: true,
        })
        return res.json({
            successStatus: true,
            redirect: '/admin/products'
        })

    } catch (error) {
        console.log(error)
    }
}

const deleteProducts = async (req, res) => {
    try {

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
}

const deleteImage = async (req, res) => {
    try {
        const num = req.body.path
        const id = req.body.id
        const product=await productModel.findById(id)

        await productModel.findByIdAndUpdate(id, 
            { $pull:
                 { images:product.images[num]
                    
                     }
                    })
    res.json({
        successStatus: true,
        redirect: '/admin/editproducts/' + id
    })
}catch (err) {
    console.log(err)
}
}

module.exports = {
    getproducts,
    viewProducts,
    addProducts,
    deleteProducts,
    editProducts,
    newProducts,
    deleteImage
}
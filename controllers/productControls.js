const userModel = require('../Models/userSchema')
const categoryModel = require('../Models/categorySchema');
const productModel = require('../Models/productSchema')
const mongoose = require('mongoose')



const getProducts = async (req, res) => {
    try {
      const page=parseInt(req.query.page)||1
      let startIndex=(page-1)*4
      let endIndex=page*4
      let searched
      let product
      let category = await categoryModel.find({ isDeleted: false })
  
      if (req.session.searchKey) {
  
        searched = req.session.searchKey || ""
  
        product = await productModel.aggregate([
          {
            '$lookup': {
              'from': 'categories',
              'localField': 'categoryId',
              'foreignField': '_id',
              'as': 'categoryId'
            }
          }, {
            '$unwind': {
              'path': '$categoryId'
            }
          }, {
            '$match': {
              'isDeleted': false,
  
            }
          }, {
            '$match': {
              $or: [
                { productName: new RegExp(searched, 'i') },
                { colour: new RegExp(searched, 'i') },
                { 'categoryId.categoryName': new RegExp(searched, 'i') },
                { brand: new RegExp(searched, 'i') }
              ]
  
            }
          }
        ])
    
      } else if (req.session.sort || req.session.from || req.session.to || req.session.categoryId) {
  
        const from = req.session.from || 0
        const to = req.session.to || 10000000
        let productName = -1
        if (req.session.sort == 1) {
          productName = 1
         
        } else if (req.session.sort == -1) {
          productName = -1
        }
        req.session.sort = null
        req.session.from = null
        req.session.to = null
  
        const categoryArray = []
        category.forEach(item => {
          categoryArray.push(item._id)
        })
  
        let categoryies = []
        if (req.session.categoryId) {
          categoryies.push(mongoose.Types.ObjectId(req.session.categoryId))
          
          req.session.categoryId = null
        } else {
          categoryies = categoryArray
         
        }
  
  
        product = await productModel.aggregate([
          {
            $match: {
              'isDeleted': false,
  
              $and: [
                { 'price': { $gte: parseInt(from) } },
                { 'price': { $lte: parseInt(to) } },
              ],
              categoryId: { $in: categoryies },
            }
          },
          {
            $sort: {
              productName,
            }
  
          }
        ])
      
      } else {
  
        product = await productModel.find({ isDeleted: false })
  
      }
      
  
   let next 
   let prev
    
  let products=product.slice(startIndex,endIndex)
  
  
  if(startIndex>0){
    prev={page:page-1}
     
  }
     
  
  if(endIndex<product.length){
     next={page:page+1}
   
  }
   
  
  
      res.render('user/watches', { products, searched, category,page,prev,next,user:req.session?.user?.name})
    } catch (err) {
      console.log(err);
    }
  }
  
  const filter = async (req, res) => {
    req.session.searchKey = req.body.search
    req.session.sort = req.body.sort
    req.session.from = req.body.from
    req.session.to = req.body.to
    req.session.categoryId = req.body.categoryId
  
    
    res.redirect('/products')
  
  }
  
  
  const productSingleview = async (req, res) => {
    try {
      const id = req.params.id
      const product = await productModel.findById(id)
     if(product){
if (req.session.user) {
        const user = await userModel.findById(req.session.user._id).populate('wishlist.productId')
        let wishlist
        user.wishlist.forEach(item => {
          if (item.productId._id == id)
            wishlist = item.productId
        })
        res.render('user/singleView', { product, wishlist, user: true })
      } else {
        const wishlist = ""
        res.render('user/singleView', { product, wishlist, user: false })
      }
  
     }else{
        res.redirect('/404')
     }
      
    } catch (err) {
      res.redirect('/404')
      console.log(err);
    }
  
  }
  
  module.exports={
    getProducts,
    productSingleview,
    filter
  }
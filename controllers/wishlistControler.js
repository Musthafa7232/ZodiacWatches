
const userModel = require('../Models/userSchema')
const productModel = require('../Models/productSchema')


const addTowishlist = async (req, res) => {
    try {
        if(req.session.user){
  const productId = req.params.id
        const user = await userModel.findById(req.session.user._id)
        const whishlistItem = {
            productId,
        }
        let count = req.body.count
        user.wishlist.forEach(item => {
            if (productId == item.productId)
                count = 1
        })
        if (count == 1) {
            await userModel.findOneAndUpdate({ _id: user._id }, {
                $pull: {
                    wishlist: {
                        productId
                    }
                }
            })
        } else {
            await userModel.findOneAndUpdate({ _id: user._id }, { $push: { wishlist: whishlistItem } })

        }
        res.json({
            successStatus: true,
            message: "Item added to Wishlist successfully"
        })
        }else{
            res.json({
              redirect:'/login'
            })
        }
      
    } catch (err) {
        console.log(err);
        res.json({
            successStatus: false,
            message: "some error occured"
        })
    }

}
const getWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.session.user._id).populate('wishlist.productId')
        res.render('user/wishlist', { user })
    } catch (err) {
        console.log(err);
    }

}

const wishTocart = async (req, res) => {
    try {
        const productId = req.params.id
        const user = await userModel.findById(req.session.user._id)
        const product = await productModel.findById(productId)
        const total = product.price
        const cartItem = {
            productId,
            quantity: 1,
        }
        let count
        let cart
        user.cart.forEach(item => {
            cart = item._id
            if (productId == item.productId)
                count = 1
        })
        if (count == 1) {
            await userModel.findOneAndUpdate({
                _id: user._id, cart: {
                    $elemMatch: {
                        _id: cart
                    }
                }
            },
                { $inc: { "cart.$.quantity": 1, cartTotal: total } })
        } else {
            await userModel.findOneAndUpdate({ _id: user._id }, { $push: { cart: cartItem } })
            await userModel.findOneAndUpdate({ _id: user._id }, { $inc: { cartTotal: total } })
        }
        await userModel.findOneAndUpdate({ _id: user._id }, {
            $pull: {
                wishlist: {
                    productId
                }
            }
        })
        res.json({
            successStatus: true,
            message: "Item added to cart successfully",
            redirect: '/wishlist'
        })
    } catch (err) {
        console.log(err);
        res.json({
            successStatus: false,
            message: "some error occured"
        })
    }

}

const removeWishlist = async (req, res) => {
    try {
        const productId = req.params.id
        const user = await userModel.findById(req.session.user._id)
        await userModel.findOneAndUpdate({ _id: user._id }, {
            $pull: {
                wishlist: {
                    productId
                }
            }
        })
        res.json({
            successStatus: true,
            message: "Item added to cart successfully",
            redirect: '/wishlist'
        })
    } catch (err) {
        console.log(err);
        res.json({
            successStatus: false,
            message: "some error occured"
        })
    }

}

module.exports = { addTowishlist, getWishlist, wishTocart, removeWishlist }
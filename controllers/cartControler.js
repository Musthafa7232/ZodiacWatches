const userModel = require('../Models/userSchema')
const productModel = require('../Models/productSchema')

const getCart = async (req, res) => {
    try {
        const product = await userModel.findOne({ _id: req.session.user._id })
            .populate('cart.productId')
        return res.render("user/cart", { product })
    } catch (err) {
        console.log(err);
    }

}



const addTocart = async (req, res) => {
    try {
        if (req.session.user) {
            const productId = req.params.id
            const user = await userModel.findById(req.session.user._id)
            const product = await productModel.findById(productId)
            
          const total= product.offer ? Math.round(product.price - product.price * product.offer/100): product.price 
          
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
            res.json({
                successStatus: true,
                message: "Item added to cart successfully"
            })
        } else {
            res.json({
                redirect: '/login'
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

const changeQuantity = async (req, res) => {
    try {
        const productId = req.params.id    
        const amount = req.body.amount
        const user = await userModel.findById(req.session.user._id)
        const product = await productModel.findById(productId)
       
        const total = (product.offer ? Math.round(product.price - product.price * product.offer/100): product.price) * amount
        const cartId = req.body.cartId

        let quantity
        user.cart.forEach(item => {
            if (item._id == cartId)
                quantity = item.quantity
        })
        
        if (quantity+amount >=product.totalStock+1){
            res.json({
                successStatus: true,
                stock: product.totalStock,
                quantity: quantity,
                totalAmount: user.cartTotal + total
            })
        }else{
           
        await userModel.findOneAndUpdate({
            _id: user._id, cart: {
                $elemMatch: {
                    _id: cartId
                }
            }
        },
            { $inc: { "cart.$.quantity": amount, cartTotal: total } })
        
if(quantity + amount==0){
    await userModel.findOneAndUpdate({
        _id: user._id
    },
        {
            $pull: {
                cart: {
                    _id: cartId
                }
            }
        })
        res.json({
            successStatus: true,
           redirect:'/cart',
           stock: product.totalStock,
           quantity: quantity,
           totalAmount: user.cartTotal + total
        })
    await userModel.findOneAndUpdate({ _id: user._id }, { $inc: { cartTotal: total } })
}else{
      res.json({
            successStatus: true,
            stock: product.totalStock,
            quantity: quantity + amount,
            totalAmount: user.cartTotal + total
        })
}
        }

      
    } catch (err) {
        console.log(err);
        res.json({
            successStatus: false,
            message: "some error occured"
        })
    }
}

const removeQuantity = async (req, res) => {
    try {
      
        const productId = req.params.id
        const user = await userModel.findById(req.session.user._id)
        const product = await productModel.findById(productId)
        const total = -(product.offer ? Math.round(product.price - product.price * product.offer/100): product.price) * req.body.quantity
      
        const cartId = req.body.cartId
       await userModel.findOneAndUpdate({
            _id: user._id
        },
            {
                $pull: {
                    cart: {
                        _id: cartId
                    }
                }
            })

        await userModel.findOneAndUpdate({ _id: user._id }, { $inc: { cartTotal: total } })
       
        res.json({
            successStatus: true,
            redirect: '/cart'
        })
    } catch (err) {
        console.log(err);
        res.json({
            successStatus: false,
            message: "some error occured"
        })
    }
}

module.exports = {
    getCart,
    addTocart,
    changeQuantity,
    removeQuantity
}
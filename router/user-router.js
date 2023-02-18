const express = require('express')
const router = express.Router()
const userControls = require('../controllers/userControls')
const userAuth = require('../middlewares/userAuth')
const registerAuth = require('../middlewares/registerAuth')
const cartControls = require('../controllers/cartControler')
const loginControls = require('../controllers/loginControler')
const orderControls = require('../controllers/orderControler')
const wishlistControls = require('../controllers/wishlistControler')
const invoice = require('../utils/puppeteer')
const paymentControls = require('../controllers/paymentControler')
const dashboardControls=require('../controllers/dashboardControls')
const addressControls=require('../controllers/addressControls')
const productControls=require('../controllers/productControls')

router.use(userAuth.isUserBlocked)
//guest
router.get('/', userAuth.isLoggedOut, userControls.getLandingPage)

//login
router.get('/login', userAuth.isLoggedOut, loginControls.getLogin)

router.post('/login', userAuth.isLoggedOut, loginControls.login)

//home
router.get('/home', userAuth.isLoggedIn, userControls.getHome)

router.post('/forgetPassword', userAuth.isLoggedOut, loginControls.getForgetpass)

router.post('/forgotPass/otp', userAuth.isLoggedOut, loginControls.forgotPassotp)

router.get('/changePassword', userAuth.isLoggedOut, loginControls.changePassword)

router.post('/changePassword', userAuth.isLoggedOut, loginControls.resetPassword)

router.get('/forgotPass/otp', userAuth.isLoggedOut, loginControls.passwordOtp)

router.get('/myAccount', userAuth.isLoggedIn, dashboardControls.getAccount)

router.get('/editUser', userAuth.isLoggedIn, dashboardControls.getEdituser)

router.get('/editUser/otp', userAuth.isLoggedIn, dashboardControls.userEditOtp)

router.post('/editUser', userAuth.isLoggedIn, dashboardControls.editUser)

router.post('/editUser/otp', userAuth.isLoggedIn, dashboardControls.checkUserotp)

//register
router.get('/register', userAuth.isLoggedOut, loginControls.getRegister)

router.post('/register', userAuth.isLoggedOut,registerAuth.validateRegister, loginControls.register)

router.get('/register/otp', userAuth.isLoggedOut, registerAuth.isRegistered, loginControls.getotp)

router.post('/register/otp',userAuth.isLoggedOut,registerAuth.isRegistered, loginControls.checkotp)

router.get('/register/resendOtp', userAuth.isLoggedOut, registerAuth.isRegistered, loginControls.resendOtp)

//products
router.get('/products', productControls.getProducts)

router.post('/products', productControls.filter)

router.patch('/products', productControls.filter)

router.get('/singleView/:id', productControls.productSingleview)

//wishlist

router.patch('/addTowishlist/:id',  wishlistControls.addTowishlist)

router.get('/wishlist', userAuth.isLoggedIn, wishlistControls.getWishlist)

router.patch('/wishTocart/:id', userAuth.isLoggedIn, wishlistControls.wishTocart)

router.patch('/removeWishlist/:id', userAuth.isLoggedIn, wishlistControls.removeWishlist)
//cart
router.get('/cart', userAuth.isLoggedIn, cartControls.getCart)

router.patch('/addTocart/:id', cartControls.addTocart)


router.put('/changeQuantity/:id', userAuth.isLoggedIn, cartControls.changeQuantity)

router.delete('/removeQuantity/:id', userAuth.isLoggedIn, cartControls.removeQuantity)

//checkout
router.get('/checkout', userAuth.isLoggedIn, orderControls.getCheckout)

router.post('/applyCoupon/:id', userAuth.isLoggedIn, orderControls.applyCoupon)

router.post('/cashOndelivery', userAuth.isLoggedIn, paymentControls.cashOndelivery)

router.get('/orderSuccess', userAuth.isLoggedIn, paymentControls.ordersuccess)

router.post('/paypal', userAuth.isLoggedIn, paymentControls.paymentPaypal)

router.post('/razorPay', userAuth.isLoggedIn, paymentControls.razorPay)

router.post('/wallet', userAuth.isLoggedIn, paymentControls.wallet)

router.get('/paypalSuccess', userAuth.isLoggedIn, paymentControls.paypalSuccess)

router.get('/razorpaySuccess', userAuth.isLoggedIn, paymentControls.razorpaySuccess)


//address
router.get('/addAddress', userAuth.isLoggedIn, addressControls.getNewaddress)

router.get('/addresses', userAuth.isLoggedIn, addressControls.getAddress)

router.post('/addAddress',userAuth.isLoggedIn,userAuth.validateAddress, addressControls.addAddress)

router.delete('/deleteAddress/:id', userAuth.isLoggedIn, addressControls.deleteAdddress)

router.get('/editAddress/:id', userAuth.isLoggedIn, addressControls.geteditAdddress)

router.post('/editAddress/:id', userAuth.isLoggedIn, addressControls.editAdddress)

// user Orders
router.get('/orders/:id', userAuth.isLoggedIn, dashboardControls.orderDetails)

router.put('/cancelOrder/:id', userAuth.isLoggedIn, dashboardControls.cancelOrder)

router.put('/returnOrder/:id', userAuth.isLoggedIn, orderControls.returnProduct)

router.get('/myorders', userAuth.isLoggedIn, dashboardControls.myOrders)

router.get('/invoice-download/:id', userAuth.isLoggedIn, invoice.makeInvoice, dashboardControls.dowloadInvoice)

//about
router.get('/about', userControls.getAbout)


//logout
router.get('/logout', userAuth.isLoggedIn, userControls.getLogout)

router.all('*', (req, res) => {
  res.render('user/404error')
})


module.exports = router;
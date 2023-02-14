const express = require('express')
const router = express.Router()
const adminControls = require('../controllers/adminControls')
const adminAuth = require('../middlewares/adminAuth')
const {upload}=require('../utils/fileUploads')
const productControls=require('../controllers/admin-productControlers')
const bannerControls=require('../controllers/admin-bannerControlers')
const categoryControls=require('../controllers/admin-categoryControlers')
const userControls=require('../controllers/admin-userControlers')
const couponControls=require('../controllers/admin-couponControlers')
const orderControls=require('../controllers/admin-orderControlers')
const invoice=require('../utils/puppeteer')

//login
router.get('/', adminAuth.isLoggedOut, adminControls.getLogin)


router.post('/', adminControls.login)

//Dashboard

router.get('/home', adminAuth.isLoggedIn, adminControls.gethome)

router.get('/dashboard/dashboard',adminAuth.isLoggedIn, adminControls.getDashboard)

router.get('/productDetails',adminAuth.isLoggedIn, adminControls.getproducts)

router.get('/downloadExcell',adminAuth.isLoggedIn,adminControls.downloadExcel)

router.get('/downloadInvoice',adminAuth.isLoggedIn,invoice.salesPdf,adminControls.SalesReport)

//Users
router.get('/users', adminAuth.isLoggedIn, userControls.getUser)

router.get('/users/view/:id', adminAuth.isLoggedIn, userControls.viewUser)

router.put('/users/:id', userControls.blockUser)

//products
router.get('/products', adminAuth.isLoggedIn, productControls.getproducts)

router.get('/addProducts', adminAuth.isLoggedIn, productControls.newProducts)

router.post('/addProducts', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 },]), productControls.addProducts)

router.get('/editproducts/:id', adminAuth.isLoggedIn, productControls.viewProducts)

router.put('/editProducts/:id', adminAuth.isLoggedIn,upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1 }, {name: 'image3', maxCount: 1 },]), productControls.editProducts)

router.patch('/deleteProducts/:id', adminAuth.isLoggedIn, productControls.deleteProducts)

router.patch('/deleteImage',productControls.deleteImage)

//category
router.get('/category', adminAuth.isLoggedIn, categoryControls.getCategory)

router.post('/category/add', categoryControls.addCategory)

router.patch('/category/:id', categoryControls.deleteCategory)

//coupons
router.get('/coupons', adminAuth.isLoggedIn, couponControls.getCoupon)

router.post('/coupon/add', couponControls.addCoupon)

router.patch('/coupon/:id', couponControls.deleteCoupon)

//banners
router.get('/banners', adminAuth.isLoggedIn, bannerControls.getBanner)

router.post('/banners',upload.single('banner'), bannerControls.addBanner)

router.patch('/deleteBanners/:id',  bannerControls.deleteBanner)

//orders
router.get('/orders', adminAuth.isLoggedIn, orderControls.orders)

router.patch('/approveReturn/:id', orderControls.approveReturn)

router.patch('/cancelReturn/:id', orderControls.cancelReturn)

router.put('/cancelOrder/:id', orderControls.cancelOrder)

router.patch('/saveChanges/:id', orderControls.saveChanges)

router.patch('/saveReturnstatus/:id', orderControls.saveReturnStatus)

//return
router.get('/returns', adminAuth.isLoggedIn, orderControls.getReturn)


//sales
router.get('/sales', adminAuth.isLoggedIn, orderControls.salesReport)

router.get('/sales/excell', adminAuth.isLoggedIn, orderControls.filteredExcel)

router.get('/sales/download',adminAuth.isLoggedIn,invoice.salesReportPdf,adminControls.SalesReport )

router.post('/sales',adminAuth.isLoggedIn, orderControls.dateFilter )
//logout
router.get('/logout', adminAuth.isLoggedIn, adminControls.getLogout)

module.exports = router;



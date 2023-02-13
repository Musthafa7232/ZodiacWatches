const express = require('express')
const router = express.Router()
const adminControls = require('../controllers/adminControls')
const adminAuth = require('../auth/adminAuth')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/products')
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({
    storage: storage,
    fileFilter : (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|webp/
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      const mimetype = filetypes.test(file.mimetype)
      if(mimetype && extname){
        return cb(null, true)
      }else{
        return cb(null, false)
      }
    }
  })

//login
router.get('/', adminAuth.isLoggedOut, adminControls.getLogin)

router.post('/', adminControls.Login)

router.get('/home', adminAuth.isLoggedIn, adminControls.gethome)

//Users
router.get('/users', adminAuth.isLoggedIn, adminControls.getUser)

router.get('/users/view/:id', adminAuth.isLoggedIn, adminControls.viewUser)

router.put('/users/:id', adminControls.blockUser)

//products
router.get('/products', adminAuth.isLoggedIn, adminControls.getproducts)

router.get('/addProducts', adminAuth.isLoggedIn, adminControls.newProducts)

router.post('/addProducts', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 },]), adminControls.addProducts)

router.get('/editproducts/:id', adminAuth.isLoggedIn, adminControls.viewProducts)

router.put('/editProducts/:id', adminAuth.isLoggedIn, adminControls.editProducts)

router.patch('/deleteProducts/:id', adminAuth.isLoggedIn, adminControls.deleteProducts)

//category
router.get('/category', adminAuth.isLoggedIn, adminControls.getCategory)

router.post('/category/add', adminControls.addCategory)

router.patch('/category/:id', adminControls.deleteCategory)

//coupons
router.get('/coupons', adminAuth.isLoggedIn, adminControls.getCoupon)

//banners
router.get('/banners', adminAuth.isLoggedIn, adminControls.getBanner)

router.post('/banners',upload.single('banner'), adminAuth.isLoggedIn, adminControls.addBanner)

router.patch('/deleteBanners/:id', adminAuth.isLoggedIn, adminControls.deleteProducts)
//logout
router.get('/logout', adminAuth.isLoggedIn, adminControls.getLogout)

module.exports = router;
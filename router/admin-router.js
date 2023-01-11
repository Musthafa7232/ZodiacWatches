const express=require('express')
const router=express.Router()
const adminControls=require('../controllers/adminControls')
const adminAuth=require('../auth/admin/admin')

router.get('/',adminAuth.isLoggedOut,adminControls.getLogin)

router.post('/',adminControls.Login)

router.get('/home',adminAuth.isLoggedIn,adminControls.gethome)

router.get('/products',adminAuth.isLoggedIn,adminControls.getproducts)

router.get('/users',adminAuth.isLoggedIn,adminControls.getUser)

router.get('/category',adminAuth.isLoggedIn,adminControls.getCategory)

router.get('/logout',adminAuth.isLoggedIn,adminControls.getLogin)

module.exports = router;
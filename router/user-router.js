const express=require('express')
const router=express.Router()
const userControls=require('../controllers/userControls')
const userAuth=require('../auth/users/userAuth')
  
router.get('/',userAuth.isLoggedOut,userControls.getLandingPage)

router.get('/login',userAuth.isLoggedOut,userControls.getLogin)

router.post('/login',userControls.login)

router.get('/home',userAuth.isLoggedIn,userControls.getHome)

router.get('/register',userAuth.isLoggedOut,userControls.getRegister)

router.post('/register',userControls.register)

router.get('/register/otp',userAuth.isLoggedOut,userControls.getotp)

router.post('/register/otp',userControls.checkotp)

router.get('/logout',userAuth.isLoggedIn,userControls.getLogout)

module.exports = router;
const express = require('express')
const router = express.Router()
const userControls = require('../controllers/userControls')
const userAuth = require('../auth/userAuth')
const registerAuth = require('../auth/registerAuth')

//guest
router.get('/', userAuth.isLoggedOut, userControls.getLandingPage)

//login
router.get('/login', userAuth.isLoggedOut, userControls.getLogin)

router.post('/login', userControls.login)

//home
router.get('/home', userAuth.isLoggedIn, userControls.getHome)

//register
router.get('/register', userAuth.isLoggedOut, userControls.getRegister)

router.post('/register', userControls.register)

router.get('/register/otp', userAuth.isLoggedOut, registerAuth.isRegistered, userControls.getotp)

router.post('/register/otp', userControls.checkotp)

router.get('/register/resendOtp', userAuth.isLoggedOut, registerAuth.isRegistered, userControls.resendOtp)

//logout
router.get('/logout', userAuth.isLoggedIn, userControls.getLogout)

module.exports = router;
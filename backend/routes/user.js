const express = require('express')
const router = express.Router()

//controller function
const { signupUser, loginUser, signupUserGoogle, loginUserGoogle } = require('../controller/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/QRlogin', loginUserByQR)

// router.get('/google-auth/signup', signupUserGoogle)
router.get('/google-auth/login', loginUserGoogle)

module.exports = router
const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')


//controller function
const { signupUser, 
    loginUser, 
    signupUserGoogle, 
    loginUserGoogle, 
    loginUserByQR, 
    saveProfilePic,
    deleteProfilePic,
    getProfilePic,
    multer } = require('../controller/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/QRlogin', loginUserByQR)

// router.get('/google-auth/signup', signupUserGoogle)
router.get('/google-auth/login', loginUserGoogle)

router.post('/profile-pic',requireAuth, multer.single('imgfile'), saveProfilePic )
router.delete('/profile-pic', requireAuth, multer.none() ,deleteProfilePic )
router.get('/profile-pic',requireAuth, getProfilePic )

module.exports = router
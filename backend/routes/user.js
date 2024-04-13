const express = require('express')
const router = express.Router()

//controller function
const { signupUser, loginUser } = require('../controller/userController')

router.post('/login', loginUser)

router.post('/signup', signupUser)

module.exports = router
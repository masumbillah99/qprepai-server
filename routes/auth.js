const express = require('express')
const authRouter = express.Router()
const {
  registerUser,
  loginUser,
  logoutUser,
  profile
} = require('../controllers/authController')

// Register new user
authRouter.post('/register', registerUser)

// Login user
authRouter.post('/login', loginUser)

// get user profile
authRouter.get('/profile', profile)

// logout user
authRouter.post('/logout', logoutUser)

module.exports = authRouter

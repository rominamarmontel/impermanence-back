const express = require('express')
const bcrypt = require('bcryptjs')
const jsonWebToken = require('jsonwebtoken')
const isAuthenticated = require('../middleware/isAuthenticated')
const User = require('../models/User.model')
const router = express.Router()

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return sendErrorResponse(
      res,
      400,
      'Please provide username, email and password'
    )
  }

  try {
    const foundUser = await User.findOne({ username: username })
    if (foundUser) {
      return sendErrorResponse(res, 400, 'This username is already taken')
    }

    const generatedSalt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, generatedSalt)

    await User.create({
      username,
      email,
      password: hashedPassword,
    })
    return res.status(201).json({ message: 'The user was created.' })
  } catch (error) {
    return sendErrorResponse(res, 500, 'TSomething went wrong during signup')
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return sendErrorResponse(res, 400, 'Please provide username and password')
  }

  try {
    const foundUser = await User.findOne({ email }).select('password')
    if (!foundUser) {
      return sendErrorResponse(res, 401, 'User not found')
    }

    const matchingPasswords = await bcrypt.compare(password, foundUser.password)
    if (!matchingPasswords) {
      return sendErrorResponse(res, 401, 'Wrong credentials')
    }

    const token = jsonWebToken.sign(
      { id: foundUser._id },
      process.env.TOKEN_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '1d',
      }
    )
    return res.status(200).json({ token, message: 'Token created.' })
  } catch (error) {
    next(error)
  }
})

router.get('/verify', isAuthenticated, async (req, res, next) => {
  res.json(req.user)
})

function sendErrorResponse(res, status, message) {
  return res.status(status).json({ error: true, message: message })
}

module.exports = router

const jsonWebToken = require('jsonwebtoken')
const User = require('../models/User.model')

async function isAuthenticated(req, res, next) {
  try {
    let token = req.headers.authorization
    if (!token) {
      return res.status(500).json({ message: 'No Token found.' })
    }
    token = token.replace('Bearer ', '')
    const payload = jsonWebToken.verify(token, process.env.TOKEN_SECRET)
    const user = await User.findById(payload.id)
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Invalid Token.' })
  }
}

module.exports = isAuthenticated

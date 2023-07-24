const jsonWebToken = require('jsonwebtoken')
const User = require('../models/User.model')

async function isAuthenticated(req, res, next) {
  try {
    let token = req.headers.authorization
    if (!token) {
      req.user = null
      return next()
    }
    token = token.replace('Bearer ', '')
    const payload = jsonWebToken.verify(token, process.env.TOKEN_SECRET)
    const user = await User.findById(payload.id)
    if (!user) {
      return sendErrorResponse(res, 401, 'User not found.')
    }
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    req.user = null
    return next()
  }
}
function sendErrorResponse(res, status, message) {
  return res.status(status).json({ error: true, message: message })
}

module.exports = isAuthenticated

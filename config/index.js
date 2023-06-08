const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// const path = require('path')

const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:3000/'

module.exports = (app) => {
  app.set('trust proxy', 1)
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  )
  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
  //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  //   if (req.method === 'OPTIONS') {
  //     res.sendStatus(200)
  //   } else {
  //     next()
  //   }
  // })
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
}

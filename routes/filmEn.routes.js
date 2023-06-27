const router = require('express').Router()
const FilmEn = require('../models/FilmEn.model')
const FilmFr = require('../models/FilmFr.model')
const fileUpload = require('../config/cloudinary-config')
const isAuthenticated = require('../middleware/isAuthenticated')

router.get('/', async (req, res, next) => {
  try {
    const films = await FilmEn.find().sort({ createdAt: -1 }).populate({
      path: 'french',
      model: 'FilmFr',
    })
    res.json(films)
  } catch (error) {
    next(error)
  }
})

module.exports = router

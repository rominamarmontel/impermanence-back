const router = require('express').Router()
const FilmEn = require('../models/FilmEn.model')

router.get('/', async (req, res, next) => {
  try {
    const films = await FilmEn.find()
    res.json(films)
  } catch (error) {
    next(error)
  }
})

module.exports = router

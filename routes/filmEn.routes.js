const router = require('express').Router()
const FilmEn = require('../models/FilmEn.model')

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

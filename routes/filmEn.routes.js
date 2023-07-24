const router = require('express').Router()
const FilmEn = require('../models/FilmEn.model')

router.get('/', async (req, res, next) => {
  try {
    const films = await FilmEn.find()
      .select('title directedBy category thumbnailImages')
      .populate({
        path: 'french',
        model: 'FilmFr',
        select: 'title directedBy category thumbnailImages',
      })
    res.json(films)
  } catch (error) {
    next(error)
  }
})

module.exports = router

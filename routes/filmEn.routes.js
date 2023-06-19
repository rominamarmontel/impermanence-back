const router = require('express').Router()
const filmEn = require('../models/FilmEn.model')
const fileUpload = require('../config/cloudinary-config')
const isAuthenticated = require('../middleware/isAuthenticated')

router.get('/', async (req, res, next) => {
  try {
    const films = await FilmFr.find()
      .populate({
        path: 'english',
        model: 'FilmEn',
      })
      .sort({ createdAt: -1 })

    res.json(films)
  } catch (error) {
    next(error)
  }
})

router.get('/films/:id', async (req, res, next) => {
  try {
    const oneFilm = await FilmEn.findById(req.params.id)
    if (!oneFilm) {
      return res.status(404).json({ error: 'Film not found' })
    }
    res.json({ oneFilm })
  } catch (error) {
    next(error)
  }
})

const path = require('path')
const FilmEn = require('../models/FilmEn.model')
const FilmFr = require('../models/FilmFr.model')
router.post(
  '/films/create',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      const filmToCreate = { ...req.body }
      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          filmToCreate.images = req.files.images.map((file) => file.path)
        }
        if (req.files.download && req.files.download[0]) {
          filmToCreate.download = req.files.download[0].path
        }
      }
      const createdFilm = await FilmEn.create(filmToCreate)
      res.status(201).json(createdFilm)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred during film creation' })
    }
  }
)

router.patch(
  '/films/edit/:id',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const FilmToUpdate = { ...req.body }
      const existingFilm = await FilmEn.findById(id)
      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          FilmToUpdate.images = req.files.images.map((file) => file.path)
        } else if (!req.files.images) {
          FilmToUpdate.images = existingFilm.images
        }
        if (req.files.download) {
          FilmToUpdate.download = req.files.download[0].path
        }
      }
      const updatedFilm = await FilmEn.findByIdAndUpdate(id, FilmToUpdate, {
        new: true,
      })
      res.status(202).json(updatedFilm)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred during film creation' })
    }
  }
)

// @desc   Delete one Film
// @route  patch /api/Films/:id
// @access isAdmin
router.delete('/films/edit/:id', isAuthenticated, async (req, res, next) => {
  try {
    await FilmEn.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = router

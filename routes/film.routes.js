const router = require('express').Router()
const Film = require('../models/Film.model')
const fileUpload = require('../config/cloudinary-config')
const isAuthenticated = require('../middleware/isAuthenticated')

// @desc   Get all Films
// @route  GET /api/Films
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const films = await Film.find().sort({
      updatedAt: -1,
    })
    res.json(films)
  } catch (error) {
    next(error)
  }
})

// @desc   Get one Film
// @route  GET /api/Films/:id
// @access Public
router.get('/:id', async (req, res, next) => {
  try {
    const getFilm = await Film.findById(req.params.id)
    if (!getFilm) {
      return res.status(404).json({ error: 'Film not found' })
    }
    res.json({ getFilm })
  } catch (error) {
    next(error)
  }
})

// @desc   Create one Film
// @route  post /api/Films/create
// @access isAdmin
const path = require('path')
router.post(
  '/create',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'telechargement' }]),
  async (req, res, next) => {
    try {
      const filmToCreate = { ...req.body }
      if (req.files) {
        console.log(req.files)
        if (req.files.images && req.files.images[0]) {
          filmToCreate.images = req.files.images.map((file) => file.path)
        }
        if (req.files.telechargement && req.files.telechargement[0]) {
          filmToCreate.telechargement = req.files.telechargement[0].path
        }
      }
      const createdFilm = await Film.create(filmToCreate)
      res.status(201).json(createdFilm)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred during film creation' })
    }
  }
)

// @desc   Edit & Update one Film
// @route  patch /api/Films/:id
// @access isAdmin
router.patch(
  '/edit/:id',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'telechargement' }]),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const FilmToUpdate = { ...req.body }
      const existingFilm = await Film.findById(id) // 既存のフィルムデータを取得

      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          FilmToUpdate.images = req.files.images.map((file) => file.path)
        } else if (!req.files.images) {
          FilmToUpdate.images = existingFilm.images
        }
        if (req.files.telechargement) {
          FilmToUpdate.telechargement = req.files.telechargement[0].path
        }
      }
      const updatedFilm = await Film.findByIdAndUpdate(id, FilmToUpdate, {
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
router.delete('/edit/:id', isAuthenticated, async (req, res, next) => {
  try {
    await Film.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = router

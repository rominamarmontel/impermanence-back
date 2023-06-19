const router = require('express').Router()
const FilmFr = require('../models/FilmFr.model')
const FilmEn = require('../models/FilmEn.model')
const fileUpload = require('../config/cloudinary-config')
const isAuthenticated = require('../middleware/isAuthenticated')

// @desc   Get all Films
// @route  GET /api/Films
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const films = await FilmFr.find()
      .sort({
        updatedAt: -1,
      })
      .populate({
        path: 'english',
        model: 'FilmEn',
      })
    const filteredFilms = films.filter((film) => film.english.length > 0)
    res.json(filteredFilms)
  } catch (error) {
    next(error)
  }
})

// @desc   Get one Film
// @route  GET /api/Films/:id
// @access Public
router.get('/:frenchId', async (req, res, next) => {
  try {
    const { frenchId } = req.params
    const getFilm = await FilmFr.findById(frenchId).populate({
      path: 'english',
      model: 'FilmEn',
    })
    if (!getFilm) {
      return res.status(404).json({ error: 'Film not found' })
    }
    res.json(getFilm)
  } catch (error) {
    next(error)
  }
})

router.get('/:frenchId/en', async (req, res, next) => {
  try {
    const { frenchId } = req.params
    const englishFilm = await FilmEn.findOne({ french: frenchId })
    if (!englishFilm) {
      return res.status(404).json({ message: 'English movie not found' })
    }

    return res.json(englishFilm)
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
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      let {
        title,
        originalTitle,
        copyright,
        directedBy,
        producedBy,
        author,
        format,
        duration,
        synopsis,
        partner,
        createdYear,
        festivalsAndAwards,
        distribution,
        internationalSales,
        stageOfProduction,
        genre,
        category,
        videoOnDemand,
        crew,
        download,
        images,
      } = req.body

      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          images = req.files.images.map((file) => file.path)
        }
        if (req.files.download && req.files.download[0]) {
          download = req.files.download[0].path
        }
      }

      const createdFilm = await FilmFr.create({
        title,
        originalTitle,
        copyright,
        directedBy,
        producedBy,
        author,
        format,
        duration,
        synopsis,
        partner,
        createdYear,
        festivalsAndAwards,
        distribution,
        internationalSales,
        stageOfProduction,
        genre,
        category,
        videoOnDemand,
        crew,
        download,
        images,
        englishFilms: [],
      })

      res.status(201).json(createdFilm)
      console.log(createdFilm)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred during film creation' })
    }
  }
)

router.post(
  '/create/en',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      const {
        title,
        originalTitle,
        copyright,
        directedBy,
        producedBy,
        author,
        format,
        duration,
        synopsis,
        partner,
        createdYear,
        festivalsAndAwards,
        distribution,
        internationalSales,
        stageOfProduction,
        genre,
        category,
        videoOnDemand,
        crew,
        download,
        images,
        frenchId,
      } = req.body
      console.log('frenchId', frenchId)
      const filmToCreate = {
        title,
        originalTitle,
        copyright,
        directedBy,
        producedBy,
        author,
        format,
        duration,
        synopsis,
        partner,
        createdYear,
        festivalsAndAwards,
        distribution,
        internationalSales,
        stageOfProduction,
        genre,
        category,
        videoOnDemand,
        crew,
        download,
        images,
        french: frenchId,
      }

      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          filmToCreate.images = req.files.images.map((file) => file.path)
        }
        if (req.files.download && req.files.download[0]) {
          filmToCreate.download = req.files.download[0].path
        }
      }

      const newEnglishFilm = await FilmEn.create(filmToCreate)
      console.log(newEnglishFilm)
      const updatedFrenchFilm = await FilmFr.findByIdAndUpdate(
        frenchId,
        { $push: { english: newEnglishFilm._id } },
        { new: true }
      )
      res.status(201).json(updatedFrenchFilm)
    } catch {
      ;(error) => {
        console.error(error)
        res
          .status(500)
          .json({ message: 'An error occurred during film creation' })
      }
    }
  }
)

// @desc   Edit & Update one Film
// @route  patch /api/Films/:id
// @access isAdmin
router.patch(
  '/edit/:frenchId',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      const { frenchId } = req.params
      const FilmToUpdate = { ...req.body }
      const existingFilm = await FilmFr.findById(frenchId)

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
      const updatedFilm = await FilmFr.findByIdAndUpdate(
        frenchId,
        FilmToUpdate,
        {
          new: true,
        }
      )
      res.status(202).json(updatedFilm)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred during film creation' })
    }
  }
)

router.patch(
  '/edit/:frenchId/en',
  isAuthenticated,
  fileUpload.fields([{ name: 'images' }, { name: 'download' }]),
  async (req, res, next) => {
    try {
      const { frenchId } = req.params
      const FilmToUpdate = { ...req.body }
      const existingFilm = await FilmEn.findOne({ french: frenchId })
      if (req.files) {
        if (req.files.images && req.files.images[0]) {
          FilmToUpdate.images = req.files.images.map((file) => file.path)
        } else {
          FilmToUpdate.images = existingFilm.images || []
        }
        if (req.files.download) {
          FilmToUpdate.download = req.files.download[0].path
        }
      } else {
        FilmToUpdate.images = existingFilm.images || []
      }

      const updatedFilm = await FilmEn.findByIdAndUpdate(
        existingFilm._id,
        FilmToUpdate,
        {
          new: true,
        }
      )

      res.status(202).json(updatedFilm)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred during film update' })
    }
  }
)

// @desc   Delete one Film
// @route  patch /api/Films/:id
// @access isAdmin
router.delete('/edit/:frenchId', isAuthenticated, async (req, res, next) => {
  const { frenchId } = req.params
  FilmFr.findByIdAndRemove(frenchId)
    .then(() =>
      res.json({
        message: `Project with ${frenchId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error))
})

module.exports = router

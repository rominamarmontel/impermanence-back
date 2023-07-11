const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'auto',
    allowed_formats: [
      'jpg',
      'png',
      'gif',
      'webp',
      'jpeg',
      'pdf',
      'tiff',
      'avif',
    ],
    folder: 'impermanenceDB',
    fieldSize: 10 * 1024 * 1024,
  },
})
const fileUpload = multer({ storage }).fields([
  { name: 'thumbnailImages', maxCount: 1 },
  { name: 'detailImages', maxCount: 3 },
  { name: 'download', maxCount: 1 },
])

module.exports = multer({ storage })

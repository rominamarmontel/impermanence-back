const { Schema, model } = require('mongoose')

const filmFrSchema = new Schema(
  {
    title: String,
    english: {
      type: Schema.Types.ObjectId,
      ref: 'FilmEn',
    },
    originalTitle: String,
    copyright: String,
    directedBy: String,
    producedBy: String,
    author: String,
    format: String,
    duration: String,
    synopsis: String,
    partner: String,
    createdYear: String,
    festivalsAndAwards: String,
    distribution: String,
    internationalSales: String,
    stageOfProduction: String,
    genre: {
      type: String,
      enum: ['documentaire', 'drama', 'science-fiction', 'comedie'],
    },
    category: {
      type: String,
      enum: ['encours', 'production', 'distribution', 'programmation'],
    },
    videoOnDemand: String,
    crew: String,
    download: String,
    thumbnailImages: [
      {
        type: String,
      },
    ],
    detailImages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)
const FilmFr = model('FilmFr', filmFrSchema)

module.exports = FilmFr

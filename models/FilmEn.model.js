const { Schema, model } = require('mongoose')

const filmEnSchema = new Schema(
  {
    title: String,
    french: {
      type: Schema.Types.ObjectId,
      ref: 'FilmFr',
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
      enum: ['documentary', 'drama', 'science-fiction', 'comedy'],
    },
    category: {
      type: String,
      enum: ['inprogress', 'production', 'distribution', 'programmation'],
    },
    videoOnDemand: String,
    crew: String,
    download: String,
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const FilmEn = model('FilmEn', filmEnSchema)

module.exports = FilmEn

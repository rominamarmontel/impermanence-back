const { Schema, model } = require('mongoose')

const filmSchema = new Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    titreOriginal: String,
    droitsDauteur: String,
    realisePar: String,
    produitPar: String,
    auteur: String,
    format: String,
    duree: String,
    synopsis: String,
    partenaire: String,
    anneeDeCreation: String,
    festivalsEtRecompenses: String,
    distribution: String,
    ventesInternationales: String,
    etapeDeProduction: String,
    genre: {
      type: String,
      enum: ['science-fiction', 'drame', 'documentaire', 'comedie'],
    },
    categorie: {
      type: String,
      enum: ['travail-en-cours', 'production', 'distribution', 'programmation'],
    },
    videoALaDemande: String,
    equipe: String,
    telechargement: String,
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

const Film = model('Film', filmSchema)

module.exports = Film

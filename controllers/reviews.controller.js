const reviewModel = require('../models/review.model')

class reviewsController {
  constructor () {}

  static showAll (req, res, next) {
    reviewModel.all()
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static getOne (req, res, next) {
    let id = req.params.id
    reviewModel.getOne(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static update (req, res, next) {
    let id = req.params.id
    let body = req.body
    reviewModel.update(id, body)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static create (req, res, next) {
    let body = req.body
    reviewModel.create(body)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static destroy (req, res, next){
    let id = req.params.id
    reviewModel.destroy(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }
}

module.exports = reviewsController

const snackModel = require('../models/snack.model')

class snacksController {
  constructor () {}

  static showAll (req, res, next) {
    snackModel.all()
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static getOneWithReviews (req, res, next) {
    let id = req.params.id

    snackModel.getOneWithReviews(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static update (req, res, next) {
    let id = req.params.id
    let body = req.body
    snackModel.update(id, body)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static destroy (req, res, next){
    let id = req.params.id
    snackModel.destroy(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }
}

module.exports = snacksController

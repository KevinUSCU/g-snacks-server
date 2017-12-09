const snackModel = require('../models/snack.model')

class snacksController {
  constructor () {}

  static showAll (req, res, next) {
    snackModel.all()
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static getOne (req, res, next) {
    let id = req.params.id
    snackModel.getOne(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static getOneWithReviews (req, res, next) {
    let id = req.params.id
    snackModel.getOneWithReviews(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }

  static create (req, res, next) {
    const { name, description, img } = req.body

    if(!name) throw new Error('requireAllFields')
    if(!description) throw new Error('requireAllFields')
    if(!img) throw new Error('requireAllFields')

    snackModel.create(req.body)
    .then((response) => res.json({response}))
    .catch(next)
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

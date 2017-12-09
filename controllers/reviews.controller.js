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
    const { title, text, rating, snack_id, user_id } = req.body

    if(!title) throw new Error('requireAllFields')
    if(!text) throw new Error('requireAllFields')
    if(!rating) throw new Error('requireAllFields')
    if(!snack_id) throw new Error('requireAllFields')
    if(!user_id) throw new Error('requireAllFields')

    reviewModel.create(req.body)
    .then((response) => res.json({response}))
    .catch(next)
  }

  static complete(req, res, next) {

  }

  static destroy (req, res, next){
    let id = req.params.id
    reviewModel.destroy(id)
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }
}

module.exports = reviewsController

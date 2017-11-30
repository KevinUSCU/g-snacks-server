const snackModel = require('../models/snack.model')

class snacksController {
  constructor () {}
  
  static showAll (req, res, next) {
    snackModel.all()
    .then((response) => res.json({response}))
    .catch((err) => res.json(err))
  }
}

module.exports = snacksController

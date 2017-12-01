const UserModel = require('../models/user.model')

class UsersController {
  static index (req, res, next) {
    // should require admin token?
    UserModel.getAll()
    .then(response => res.json({response}))
    .catch(err => res.json(err))
  }

  static showOne (req, res, next) {
    // should require admin or this user's token?
    UserModel.getUser(req.params.id)
    .then(response => res.json({response}))
    .catch(err => res.json(err))
  }

  static create (req, res, next) {
    // create is the same as signing up a new user; no token required
    const { first_name, last_name, email, password } = req.body
    // need to verify all fields and no duplicate emails
    UserModel.create(first_name, last_name, email, password)
    .then(response => res.json({response}))
    .catch(err => res.json(err))
  }

  static update (req, res, next) {

  }

  static destroy (req, res, next) {
    
  }

  static login (req, res, next) {

  }
}

module.exports = UsersController
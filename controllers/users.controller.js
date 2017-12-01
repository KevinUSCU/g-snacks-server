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
    // verify all fields exist
    if (!first_name) return next({ status: 400, error: 'First name is required' })
    if (!last_name) return next({ status: 400, error: 'Last name is required' })
    if (!email) return next({ status: 400, error: 'Email address is required' })
    if (!password) return next({ status: 400, error: 'A password is required' })
    // verify email is unique
    UserModel.getUserByEmail(email)
    .then(user => {
      if (user) return next({ status: 409, error: 'A user with this email address already exists.' })
      return UserModel.create(first_name, last_name, email, password)
    })
    .then(() => UserModel.requestToken(email, password))
    .then(token => res.json({ token }))
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
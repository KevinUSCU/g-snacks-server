const UserModel = require('../models/user.model')
const Token = require('../models/token.model')
const serverError = require('./errors.controller').serverError
const bcrypt = require('bcryptjs')

class UsersController {
  static index (req, res, next) {
    // Require admin token to retrieve index of all users
    // Get token from auth header
    const authorization = req.headers.authorization
    Token.extractBearerToken(authorization)
    // This catch will grab errors from the token decoding process (such as no token or invalid token)
    // .catch(err => next({ status: 401, message: 'A valid authorization token is required' }))
    .then(token => {
      if (token.sub.role !== 'admin') {
        next({ status: 401, message: 'User not authorized for this resource' })
        throw new Error()
      }
      return //pass auth check
    })
    // Get users data from database
    .then(() => UserModel.getAll())
    .then(users => res.status(200).json({ response: users }))
    .catch(err => serverError(err, next))
  }

  static showOne (req, res, next) {
    // should require admin or this user's token?
    const id = req.params.id
    UserModel.getUser(id)
    .then(user => {
      if (!user) return next({ status: 404, message: `User ${id} does not exist` })
      return res.json(user)
    })
    .catch(err => serverError(err, next))
  }

  static create (req, res, next) {
    // create is equivalent to signing up a new user; no token is required
    const { first_name, last_name, email, password } = req.body
    // verify all fields exist
    if (!first_name) return next({ status: 400, message: 'First name is required' })
    if (!last_name) return next({ status: 400, message: 'Last name is required' })
    if (!email) return next({ status: 400, message: 'Email address is required' })
    if (!password) return next({ status: 400, message: 'A password is required' })
    // verify email is unique
    UserModel.getUserForVerification(email)
    .then(user => {
      if (user) {
        next({ status: 409, message: 'A user with this email address already exists.' })
        throw new Error() //this will stop execution of the following .then code and be caught by serverError()
      }
      // add new user to database
      return UserModel.create(first_name, last_name, email, password)
    })
    // Sign and return token
    .then(newUser => Token.signAsync(newUser[0].id, first_name, last_name, newUser[0].role))
    .then(token => res.status(201).json({ token }))
    .catch(err => serverError(err, next))
  }

  static update (req, res, next) {
    const id = req.params.id
    const { first_name, last_name, email, password, role } = req.body
    UserModel.update(id, first_name, last_name, email, password, role)
    .then(userId => {
      if (userId[0]) return res.status(200).json(userId[0].id)
      return next({ status: 404, message: 'User does not exist.' })
    })
  }

  static destroy (req, res, next) {
    const id = req.params.id
    return UserModel.destroy(id)
    .then(userId => {
      if (!userId) return next({ status: 404, message: 'This user did not exist.' })
      return res.status(204)
    })
  }

  static login (req, res, next) {
    const { email, password } = req.body
    UserModel.getUserForVerification(email)
    .then(user => {
      if (!user) {
        next({ status: 404, message: 'User does not exist' })
        throw new Error()
      }
      if (!password) {
        next({ status: 400, message: 'Password is required' })
        throw new Error()
      }
      if (!bcrypt.compareSync(password, user.hashed_password)) {
        next({ status: 401, message: 'Incorrect password' })
        throw new Error()
      }
      return user
    })
    .then(user => {
      const { id, first_name, last_name, role } = user
      return Token.signAsync(id, first_name, last_name, role)
    })
    .then(token => res.status(201).json({ token }))
    .catch(err => serverError(err, next))
  }

  

  // this will verify a user
  static verify (token) {

  }
}

module.exports = UsersController
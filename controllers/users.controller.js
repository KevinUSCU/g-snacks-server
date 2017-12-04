const UserModel = require('../models/user.model')
const Token = require('../models/token.model')
const serverError = require('./errors.controller').serverError
const bcrypt = require('bcryptjs')

class UsersController {

  static index (req, res, next) {
    // *** Require admin token to retrieve index of all users ***
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => {
      // This catch will grab errors from the token decoding process (such as no token or invalid token)
      next({ status: 401, message: 'A valid authorization token is required' })
      throw new Error() //this will stop execution of the following .then code and be caught by serverError()
    })
    .then(token => {
      if (token.sub.role !== 'admin') {
        next({ status: 401, message: 'User is not authorized for this resource' })
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
    // *** This route requires either role of 'admin' or the user who's id we are requesting ***
    const id = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => {
      // This catch will grab errors from the token decoding process (such as no token or invalid token)
      next({ status: 401, message: 'A valid authorization token is required' })
      throw new Error() //this will stop execution of the following .then code and be caught by serverError()
    })
    .then(token => {
      if (!(token.sub.role === 'admin' || (token.sub.role === 'user' && token.sub.id == id))) {
        next({ status: 401, message: 'User is not authorized for this resource' })
        throw new Error()
      }
      return //pass auth check
    })
    // Get user data from database
    .then(() => UserModel.getUser(id))
    .then(user => {
      if (!user) return next({ status: 404, message: `User does not exist` })
      return res.status(200).json({ response: user })
    })
    .catch(err => serverError(err, next))
  }

  static create (req, res, next) {
    // *** Create is equivalent to signing up a new user; no token is required ***
    const { first_name, last_name, email, password } = req.body
    // Verify all fields exist
    if (!first_name) return next({ status: 400, message: 'First name is required' })
    if (!last_name) return next({ status: 400, message: 'Last name is required' })
    if (!email) return next({ status: 400, message: 'Email address is required' })
    if (!password) return next({ status: 400, message: 'A password is required' })
    // Verify that email is unique
    UserModel.getUserForVerification(email)
    .then(user => {
      if (user) {
        next({ status: 409, message: 'A user with this email address already exists.' })
        throw new Error() //this will stop execution of the following .then code and be caught by serverError()
      }
      // If unique, add new user to database; all new users created with role of 'user'
      return UserModel.create(first_name, last_name, email, password)
    })
    // Sign and return a token for the new user
    .then(newUser => Token.sign(newUser[0].id, first_name, last_name, newUser[0].role))
    // Return token to client
    .then(token => res.status(201).json({ response: token }))
    .catch(err => serverError(err, next))
  }

  static update (req, res, next) {
    // *** Editing profile data requires the user who's id we are updating ***
    const id = req.params.id
    const { first_name, last_name, email, password, role } = req.body
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => {
      // This catch will grab errors from the token decoding process (such as no token or invalid token)
      next({ status: 401, message: 'A valid authorization token is required' })
      throw new Error() //this will stop execution of the following .then code and be caught by serverError()
    })
    .then(token => {
      if (token.sub.id != id) {
        next({ status: 401, message: 'User is not authorized for this resource' })
        throw new Error()
      }
      return //pass auth check
    })
    // Update user profile with supplied data
    .then(() => UserModel.update(id, first_name, last_name, email, password, role))
    // Sign and return updated token
    .then(user => {
      if (!user) {
        next ({ status: 404, message: 'User does not exist.' })
        throw new Error()
      }
      const { id, first_name, last_name, role } = user[0]
      return Token.sign(id, first_name, last_name, role)
    })
    // Return token to client
    .then(token => res.status(201).json({ response: token }))
    .catch(err => serverError(err, next))
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
    // *** Login requires email and password (no token), and will return a token ***
    // Get supplied email and password and grab user match from db
    const { email, password } = req.body
    if (!email) return next({ status: 400, message: 'Email address is required'})
    if (!password) return next({ status: 401, message: 'Password is required' })
    UserModel.getUserForVerification(email)
    .then(user => {
      if (!user) {
        next({ status: 404, message: 'User does not exist' })
        throw new Error()
      }
      // Check for supplied password match against stored hash
      if (!bcrypt.compareSync(password, user.hashed_password)) {
        next({ status: 401, message: 'Incorrect password' })
        throw new Error()
      }
      // Pass user data to token signing step
      return user
    })
    .then(user => {
      // Sign new token with user data
      const { id, first_name, last_name, role } = user
      return Token.sign(id, first_name, last_name, role)
    })
    // Return token to client
    .then(token => res.status(201).json({ response: token }))
    .catch(err => serverError(err, next))
  }

  

  // this will verify a user
  static verify (token) {

  }
}

module.exports = UsersController
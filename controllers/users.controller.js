const UserModel = require('../models/user.model')
const Token = require('../models/token.model')
const processError = require('./errors.controller')
const bcrypt = require('bcryptjs')

class UsersController {

  static index (req, res, next) {
    // *** Require admin token to retrieve index of all users ***
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.role !== 'admin') throw new Error('unauthorizedUser')
      // Pass auth check; get users from db
      return UserModel.getAll()
    })
    .then(users => res.status(200).json({ response: users }))
    .catch(err => processError(err, next))
  }

  static showOne (req, res, next) {
    // *** This route requires either role of 'admin' or the user who's id we are requesting ***
    const id = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (!(user.role === 'admin' || (user.role === 'user' && user.id == id))) throw new Error('unauthorizedUser')
      // Pass auth check; get user data from db
      return UserModel.getUser(id)
    })
    .then(user => {
      if (!user) throw new Error('noSuchUser')
      return res.status(200).json({ response: user })
    })
    .catch(err => processError(err, next))
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
    UserModel.getUserIdByEmail(email)
    .then(existingUser => {
      if (existingUser) throw new Error('duplicateUser')
      // If unique, add new user to database; all new users created with role of 'user'
      return UserModel.create(first_name, last_name, email, password)
    })
    // Sign and return a token for the new user
    .then(newUserId => Token.sign(newUserId[0].id))
    // Return token to client
    .then(token => res.status(201).json({ response: token }))
    .catch(err => processError(err, next))
  }

  static update (req, res, next) {
    // *** Editing profile data requires the user who's id we are updating ***
    const id = req.params.id
    const { first_name, last_name, email, password } = req.body
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify User
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.id != id) throw new Error('unauthorizedUser')
      // Pass auth check
      // If email was changed, verify no duplicates
      if (email) {
        return UserrModel.getUserIdByEmail(email)
        .then(existingUser => {
          if (existingUser) throw new Error('duplicateUser')
        })
      } else return
    })
    // Update user profile with supplied data
    .then(() => UserModel.update(id, first_name, last_name, email, password))
    .then(userId => res.status(200).json({ response: userId }))
    .catch(err => processError(err, next))
  }

  static destroy (req, res, next) {
    // *** Deleting a user requires either role of 'admin' or the user who's id we are requesting ***
    const id = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (!(user.role === 'admin' || (user.role === 'user' && user.id == id))) throw new Error('unauthorizedUser')
      //pass auth check; delete user
      return UserModel.destroy(id)
    })
    .then(response => res.status(204).json())
    .catch(err => processError(err, next))
  }

  static login (req, res, next) {
    // *** Login requires email and password (no token), and will return a token ***
    // Get supplied email and password and grab user match from db
    const { email, password } = req.body
    if (!email) return next({ status: 400, message: 'Email address is required'})
    if (!password) return next({ status: 401, message: 'Password is required' })
    // Retrieve user match from database
    UserModel.getUserForVerification(email)
    .then(user => {
      if (!user) throw new Error('noSuchUser')
      // Check for supplied password match against stored hash
      if (!bcrypt.compareSync(password, user.hashed_password)) throw new Error('invalidPassword')
      // Sign new token with user id
      return Token.sign(user.id)
    })
    // Return token to client
    .then(token => res.status(201).json({ response: token }))
    .catch(err => processError(err, next))
  }

  static changeRole (req, res, next) {
    // An 'admin' token is required to change the role of another user
    const id = req.params.id
    const role = req.body.role
    if (!role) return next({ status: 400, message: 'Role attribute is required'})
    if (role !== 'admin' && role !== 'user') return next({ status: 400, message: "Role attribute must be either 'admin' or 'user'" })
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => ThrowError.invalidToken(next))
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.role !== 'admin') throw new Error('unauthorizedUser')
      // Pass auth check; update role of user in db
      return UserModel.update(id, undefined, undefined, undefined, undefined, role)
    })
    .then(userId => {
      if (!userId) throw new Error('noSuchUser')
      return res.status(200).json({ response: userId })
    })
    .catch(err => processError(err, next))
  }
}

module.exports = UsersController
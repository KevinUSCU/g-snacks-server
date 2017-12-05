const UserModel = require('../models/user.model')
const Token = require('../models/token.model')
const bcrypt = require('bcryptjs')

class UsersController {

  static index (req, res, next) {
    // *** Require admin token to retrieve index of all users ***
    return UserModel.getAll()
    .then(users => res.status(200).json({ response: users }))
    .catch(next)
  }

  static showOne (req, res, next) {
    // *** This route requires either role of 'admin' or the user who's id we are requesting ***
    const id = req.params.id
    // Get user data from db
    return UserModel.getUser(id)
    .then(user => {
      if (!user) throw new Error('noSuchUser')
      return res.status(200).json({ response: user })
    })
    .catch(next)
  }

  static showOneFromToken (req, res, next) {
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    .then(user => {
      if (!user) throw new Error('noSuchUser')
      return res.status(200).json({ response: user })
    })
    .catch(next)
  }

  static create (req, res, next) {
    // *** Create is equivalent to signing up a new user; no token is required ***
    const { first_name, last_name, email, password } = req.body
    // Verify all fields exist
    // if (!first_name) return next({ status: 400, message: 'First name is required' })
    if (!first_name) throw new Error('missingFirstName')
    if (!last_name) throw new Error('missingLastName')
    if (!email) throw new Error('missingEmail')
    if (!password) throw new Error('missingPassword')
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
    .catch(next)
  }

  static update (req, res, next) {
    // *** Editing profile data requires the user who's id we are updating ***
    const id = req.params.id
    const { first_name, last_name, email, password } = req.body
    // If email was changed, verify no duplicates
    if (email) {
      return UserModel.getUserIdByEmail(email)
      .then(existingUser => {
        if (existingUser) throw new Error('duplicateUser')
      })
      // Update user profile with supplied data
      .then(() => UserModel.update(id, first_name, last_name, email, password))
      .then(userId => res.status(200).json({ response: userId }))
      .catch(next)
    } else {
      // Update user profile with supplied data
      return UserModel.update(id, first_name, last_name, undefined, password)
      .then(userId => res.status(200).json({ response: userId }))
      .catch(next)
    }
  }

  static destroy (req, res, next) {
    // *** Deleting a user requires either role of 'admin' or the user who's id we are requesting ***
    const id = req.params.id
    // Delete user
    return UserModel.destroy(id)
    .then(response => res.status(204).json())
    .catch(next)
  }

  static login (req, res, next) {
    // *** Login requires email and password (no token), and will return a token ***
    // Get supplied email and password and grab user match from db
    const { email, password } = req.body
    if (!email) throw new Error('missingEmail')
    if (!password) throw new Error('missingPassword')
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
    .catch(next)
  }

  static changeRole (req, res, next) {
    // An 'admin' token is required to change the role of another user
    const id = req.params.id
    const role = req.body.role
    if (!role) throw new Error('missingRole')
    if (role !== 'admin' && role !== 'user') throw new Error('incorrectRoleType')
    // Update role of user in db
    return UserModel.update(id, undefined, undefined, undefined, undefined, role)
    .then(userId => {
      if (!userId) throw new Error('noSuchUser')
      return res.status(200).json({ response: userId })
    })
    .catch(next)
  }
}

module.exports = UsersController
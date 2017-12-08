const UserModel = require('../models/user.model')
const ReviewModel = require('../models/review.model')
const Token = require('../models/token.model')

class Auth {

  // Verify requestor is a currently valid account holder (user or admin)
  static isCurrent (req, res, next) {
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      next() // pass auth check
    })
    .catch(next) // fail auth check
  }

  // Verify role is admin
  static isAdmin (req, res, next) {
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify user
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.role !== 'admin') throw new Error('unauthorizedUser')
      next() // pass auth check
    })
    .catch(next) // fail auth check
  }

  // Verify user owns the USER TABLE resource...
  static isOwnerOfUser (req, res, next) {
    const userId = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify User
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (user.id != userId) throw new Error('unauthorizedUser')
      next() // pass auth check
    })
    .catch(next) // fail auth check
  }

  // Verify admin or a user who owns the USER TABLE resource...
  static isOwnerOfUserOrAdmin (req, res, next) {
    const userId = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user from database
    .then(token => UserModel.getUser(token.sub.id))
    // Verify User
    .then(user => {
      if (!user) throw new Error('requestorInvalid')
      if (!(user.role === 'admin' || (user.role === 'user' && user.id == userId))) throw new Error('unauthorizedUser')
      next() // pass auth check
    })
    .catch(next) // fail auth check
  }

  // Verify user owns the REVIEW...
  static isOwnerOfReview (req, res, next) {
    const reviewId = req.params.id
    // Validate and decode token
    Token.verifyAndExtractHeaderToken(req.headers)
    .catch(err => { throw new Error('invalidToken') })
    // Check for and retrieve user and review from database
    .then(token => {
      const promises = [ UserModel.getUser(token.sub.id), ReviewModel.getOne(reviewId) ]
      return Promise.all(promises)
    })
    // Verify User & that User owns Review
    .then(results => {
      const [ user, review ] = results
      if (!user) throw new Error('requestorInvalid')
      if (user.id != review.user_id) throw new Error('unauthorizedUser')
      next() // pass auth check
    })
    .catch(next) // fail auth check
  }
}

module.exports = Auth
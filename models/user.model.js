const db = require('../db/knex')
const { promisify } = require('util')
const { hash, compare } = require('bcryptjs')
const hashPromise = promisify(hash)
const comparePromise = promisify(compare)
const Token = require('./token.model')

class UserModel {
  static getAll () {
    return db('users')
    .select('id', 'first_name', 'last_name', 'email', 'role')
  }

  static getUser (id) {
    return db('users')
    .select('id', 'first_name', 'last_name', 'email', 'role')
    .where({ id })
    .first()
  }

  static getUserByEmail(email) {
    return db('users')
    .select('email')
    .where({ email })
    .first()
  }

  static create (first_name, last_name, email, password) { 
    return hashPromise(password)
    .then(hashed_password => {
      return db('users')
      .insert({ first_name, last_name, email, hashed_password })
      // note that 'role' is automatically defaulted to 'user' by the db
      .returning(['id'])
    })
    .catch(error => { throw error })
  }

  static update (id, first_name, last_name, email, password, role) {
    if (password) {
      return hashPromise(password)
      .then(hashed_password => {
        return db('users')
        .where({ id })
        .update({ first_name, last_name, email, hashed_password, role, thisKeyIsSkipped: undefined })
        .returning(['id'])
      })
      .catch(error => { throw error })
    } else {
      return db('users')
      .where({ id })
      .update({ first_name, last_name, email, role, thisKeyIsSkipped: undefined })
      .returning(['id'])
    }
  }

  static destroy (id) {
    return db('users')
    .where({ id })
    .del()
    .returning(['id'])
  }

  // requestToken is the equivalent of logging in
  static requestToken (email, password) {
    return db('users')
    .select('id', 'first_name', 'last_name', 'hashed_password')
    .where({ email })
    .first()
    .then(user => {
      if (!user) throw new Error('No such user')
      if (!bcrypt.compareSync(password, user.hashed_password)) throw new Error('Incorrect password')
      return user
    })
    .then(user => Token.signAsync(user))
    .catch(error => { throw error })
  }

  // this will verify a user
  static verify (token) {

  }
}


module.exports = UserModel

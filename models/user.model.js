const db = require('../db/knex')
const bcrypt = require('bcryptjs')

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

  static getUserForVerification(email) {
    return db('users')
    .select('id', 'first_name', 'last_name', 'role', 'hashed_password')
    .where({ email })
    .first()
  }

  static create (first_name, last_name, email, password) { 
    const hashed_password = bcrypt.hashSync(password)
    return db('users')
    .insert({ first_name, last_name, email, hashed_password })
    // note that 'role' is automatically defaulted to 'user' by the db
    .returning(['id', 'role'])
  }

  static update (id, first_name, last_name, email, password, role) {
    let hashed_password
    if (password) hashed_password = bcrypt.hashSync(password)
    return db('users')
      .where({ id })
      .update({ first_name, last_name, email, hashed_password, role, thisKeyIsSkipped: undefined })
      .returning(['id'])
  }

  static destroy (id) {
    return db('users')
    .where({ id })
    .returning(['id'])
    .del()
  }

}


module.exports = UserModel

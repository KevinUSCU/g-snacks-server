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

  // create is the same as signing up a new user
  static create (first_name, last_name, email, password) {
    const hashed_password = bcrypt.hashSync(password)
    return db('users')
    .insert({ first_name, last_name, email, hashed_password })
    .returning(['id', 'hashed_password'])
  }

  static update () {

  }

  static destroy (id) {
    return db('users')
    .where({ id })
    .del()
    .returning(['id'])
  }

  // requestToken is the equivalent of logging in
  static requestToken (email, password) {

  }

  // this will verify a user
  static verify (token) {

  }
}


module.exports = UserModel


function updateShroom(id, owner_id, name, cap, base, mouth, eyes, eyeballs, eyebrows, flourish, cap_color_1, cap_color_2) {
  return knex('shrooms')
  .where({ id })
  .update({ owner_id, name, cap, base, mouth, eyes, eyeballs, eyebrows, flourish, cap_color_1, cap_color_2, thisKeyIsSkipped: undefined })
  .returning(['name'])
}

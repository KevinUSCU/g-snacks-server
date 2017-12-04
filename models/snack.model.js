const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
    // return db('snacks_dev')
  }

  static getOne (id) {
    return db('snacks')
    .where({id})
    .first()
  }

  static destroy (id) {
    return db('snacks')
    .where({id})
    .del()
    .returning('*')
  }
}

module.exports = snackModel

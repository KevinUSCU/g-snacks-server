const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
    // return db('snacks_dev')
  }
}

module.exports = snackModel

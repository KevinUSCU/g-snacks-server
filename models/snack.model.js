const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
  }

  static create (name, description, img) {
    return db('snacks')
    .insert(name, description, img)
    .returning('*')
  }

  static getOne (id) {
    return db('snacks')
    .where({id})
    .first()
  }

  static update (id, body) {
    return db('snacks')
    .where({id})
    .update({name: body.name, description: body.description, img: body.img})
    .returning('*')
  }

  static destroy (id) {
    return db('snacks')
    .where({id})
    .del()
    .returning('*')
  }
}

module.exports = snackModel

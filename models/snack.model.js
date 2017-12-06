const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
  }

  static getOneWithReviews (id) {
    return db('snacks')
    .join('reviews', 'snacks.id', 'reviews.snack_id')
    .where('snack_id', id)
    .join('users', 'users.id', 'reviews.user_id')
  }

  static getAllReviewsForOneSnack(id) {
    return db('reviews')
		.where('snack_id', id)
    .returning('*')
  }

  static update (id, body) {
    return db('snacks')
    .where({id})
    .update({name: body.name, description: body.description})
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

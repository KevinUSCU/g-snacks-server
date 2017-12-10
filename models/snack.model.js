const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
    .orderBy('name')
  }

  static getOne (id) {
    return db('snacks')
    .where('snacks.id', id)
    .first()
  }

  static getOneWithReviews (id) {
    return db('snacks')
    .select('reviews.id as review_id', 'title', 'text', 'rating', 'snack_id', 'user_id', 'first_name', 'last_name', 'name', 'description', 'price', 'img')
    .leftJoin('reviews', 'snacks.id', 'reviews.snack_id')
    .where('snacks.id', id)
    .leftJoin('users', 'users.id', 'reviews.user_id')
  }

  static getAllReviewsForOneSnack(id) {
    return db('reviews')
		.where('snack_id', id)
    .returning('*')
  }

  static create (name, description, img) {
    return db('snacks')
    .insert(name, description, img)
    .returning('*')
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

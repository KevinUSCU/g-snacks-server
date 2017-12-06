const db = require('../db/knex')

class snackModel {
  constructor () {}

  static all () {
    return db('snacks')
  }

<<<<<<< HEAD
  static create (name, description, img) {
    return db('snacks')
    .insert(name, description, img)
    .returning('*')
  }

  static getOne (id) {
=======
  static getOneWithReviews (id) {
>>>>>>> 6978ba6f8f5b749ade4ede72496218a679397b20
    return db('snacks')
    .leftJoin('reviews', 'snacks.id', 'reviews.snack_id')
    .where('snacks.id', id)
    .leftJoin('users', 'users.id', 'reviews.user_id')
  }

  static getAllReviewsForOneSnack(id) {
    return db('reviews')
		.where('snack_id', id)
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

exports.seed = function(knex, Promise) {
  // Inserts sample reviews
  return knex('reviews').insert([
    {id: 1, title: 'Wow!', text: 'These are delicous!', rating: 3, snack_id: 1, user_id: 3},
    {id: 2, title: 'Ew', text: 'There are not delicous!', rating: 2, snack_id: 2, user_id: 2},
    {id: 3, title: 'huh?', text: 'random gibberish random gibberish random gibberish', rating: 4, snack_id: 3, user_id: 1}
  ])
  .then(() => {
    return knex.raw(`SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));`)
  })
}

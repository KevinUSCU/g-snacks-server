exports.seed = function(knex, Promise) {
  // Inserts sample reviews
  return knex('reviews').insert([
    
  ])
  .then(() => {
    return knex.raw(`SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));`)
  })
}

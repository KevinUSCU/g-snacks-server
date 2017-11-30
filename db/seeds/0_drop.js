
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('reviews').del()
    .then(() => knex('users').del())
    .then(() => knex('snacks').del())
}

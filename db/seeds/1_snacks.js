const snacks = require('../data/snacks.json')

exports.seed = function(knex, Promise) {
  return knex('snacks').del()
    .then(() => {
      return knex.raw(`SELECT setval('snacks_id_seq', '1', 'false');`)
    })
    .then(() => {
      return knex('snacks').insert(snacks);
    })
}

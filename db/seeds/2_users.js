exports.seed = function(knex, Promise) {
  // Inserts sample users
  return knex('users').insert([
    { id: 1, first_name: 'Ella', last_name: 'Fitzgerald', email: 'ella.fitz@gmail.com', hashed_password: '' },
    { id: 2, first_name: 'Marco', last_name: 'Polo', email: 'mp@gmail.com', hashed_password: '', role: 'admin' },
    { id: 3, first_name: 'Scooby', last_name: 'Doo', email: 's.snacks@yahoo.com', hashed_password: '' }
  ])
  .then(() => {
    return knex.raw(`SELECT setval('users_id_sequence', (SELECT MAX(id) FROM users));`)
  })
}

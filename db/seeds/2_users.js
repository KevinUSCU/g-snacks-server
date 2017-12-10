exports.seed = function(knex, Promise) {
  // Inserts sample users
  // Plain text password for all sample users is 'password'
  return knex('users').insert([
    { id: 1, first_name: 'Ella', last_name: 'Fitzgerald', email: 'ella.fitz@gmail.com', hashed_password: '$2a$10$x5BXBKwhjo.VCl8A/tuFfuLfEv8narDxPbvx6yMHlG.Y6EreIcCFa' },
    { id: 2, first_name: 'Marco', last_name: 'Polo', email: 'mp@gmail.com', hashed_password: '$2a$10$x5BXBKwhjo.VCl8A/tuFfuLfEv8narDxPbvx6yMHlG.Y6EreIcCFa', role: 'admin' },
    { id: 3, first_name: 'Scooby', last_name: 'Doo', email: 's.snacks@yahoo.com', hashed_password: '$2a$10$x5BXBKwhjo.VCl8A/tuFfuLfEv8narDxPbvx6yMHlG.Y6EreIcCFa' },
    { id: 4, first_name: 'Cookie', last_name: 'Monster', email: 'user@gmail.com', hashed_password: '$2a$10$x5BXBKwhjo.VCl8A/tuFfuLfEv8narDxPbvx6yMHlG.Y6EreIcCFa' },
    { id: 5, first_name: 'Jabba', last_name: 'The Hutt', email: 'admin@gmail.com', role: 'admin', hashed_password: '$2a$10$x5BXBKwhjo.VCl8A/tuFfuLfEv8narDxPbvx6yMHlG.Y6EreIcCFa' }
  ])
  .then(() => {
    return knex.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`)
  })
}

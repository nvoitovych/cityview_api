
exports.up = knex => knex.schema.createTable('user_credentials', (table) => {
  table.increments('id');
  table.string('email').unique();
  table.string('password').notNullable();
  table.string('username');
  table.bool('isEmployee', false);
  table.bool('isActive', false);
  table.datetime('created_at').notNullable();
  table.timestamp('updated_at', false);
});

exports.down = knex => knex.schema.dropTable('user_credentials');

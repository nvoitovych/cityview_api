
exports.up = knex => knex.schema.createTable('user_credentials', (table) => {
  table.increments('id');
  table.string('email').unique();
  table.string('password');
  table.string('username');
  table.string('provider');
  table.string('uid');
  table.string('photo_url');
  table.bool('is_employee', false);
  table.bool('is_active', false);
  table.datetime('created_at').notNullable();
  table.timestamp('updated_at', false);
});

exports.down = knex => knex.schema.dropTable('user_credentials');

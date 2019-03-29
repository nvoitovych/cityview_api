
exports.up = knex => knex.schema.createTable('user_credentials', (table) => {
  table.increments('id');
  table.string('email').unique();
  table.string('password');
  table.string('username');
  table.string('google_id').unique();
  table.string('facebook_id').unique();
  table.bool('is_employee', false).default(false).notNullable();
  table.bool('is_active', false).default(false).notNullable();
  table.datetime('created_at').notNullable();
  table.timestamp('updated_at', false).notNullable();
});

exports.down = knex => knex.schema.dropTable('user_credentials');

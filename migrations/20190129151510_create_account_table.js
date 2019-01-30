
exports.up = knex => knex.schema.createTable('account', (table) => {
  table.increments('id'); // id serial primary key
  table.integer('user_id').unsigned();
  table.string('name');
  table.string('surname');
  table.string('avatar_url');
  table.datetime('created_at').notNullable();
  table.timestamp('updated_at', false);

  table.foreign('user_id').references('id').inTable('user_credentials');
});
exports.down = knex => knex.schema.dropTable('account');

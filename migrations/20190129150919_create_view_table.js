
exports.up = knex => knex.schema.createTable('view', (table) => {
  table.increments('id'); // id serial primary key
  table.string('name');
  table.text('description');
  table.double('latitude');
  table.double('longitude');
  table.integer('year_of_origin');
  table.string('photo_url');
  table.string('street');
  table.string('city');
  table.string('region');
  table.string('country');
  table.integer('user_id').unsigned();
  table.timestamp('updated_at', false);
  table.datetime('created_at').notNullable();
  table.enu('status', ['banned', 'active']);

  table.foreign('user_id').references('id').inTable('user_credentials');
});
exports.down = knex => knex.schema.dropTable('view');

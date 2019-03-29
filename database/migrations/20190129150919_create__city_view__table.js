
exports.up = knex => knex.schema.createTable('city_view', (table) => {
  table.increments('id'); // id serial primary key
  table.string('name').notNullable();
  table.text('description');
  table.double('latitude').notNullable();
  table.double('longitude').notNullable();
  table.integer('year_of_origin').notNullable();
  table.string('photo_url').notNullable();
  table.string('street');
  table.string('city');
  table.string('region');
  table.string('country');
  table.string('address');
  table.integer('user_id').unsigned();
  table.timestamp('updated_at', false);
  table.datetime('created_at').notNullable();
  table.enu('status', ['banned', 'active', 'processing']).notNullable();

  table.foreign('user_id').references('id').inTable('user_credentials');
});
exports.down = knex => knex.schema.dropTable('city_view');

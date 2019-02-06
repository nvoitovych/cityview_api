exports.seed = knex => knex('city_view').insert([
  {
    id: 1, user_id: 1, name: 'name1', latitude: 1, longitude: 1, year_of_origin: 1900, photo_url: 'photo_url1', status: 'active', created_at: new Date(),
  },
  {
    id: 2, user_id: 1, name: 'name2', latitude: 2, longitude: 2, year_of_origin: 1900, photo_url: 'photo_url2', status: 'active', created_at: new Date(),
  },
  {
    id: 3, user_id: 1, name: 'name3', latitude: 1, longitude: 1, year_of_origin: 2000, photo_url: 'photo_url3', status: 'active', description: 'description', created_at: new Date(),
  },
  {
    id: 4, user_id: 4, name: 'name4', latitude: 4, longitude: 4, year_of_origin: 1955, photo_url: 'photo_url4', status: 'banned', created_at: new Date(),
  },
  {
    id: 5, user_id: 5, name: 'name5', latitude: 5, longitude: 5, year_of_origin: 1999, photo_url: 'photo_url5', status: 'active', created_at: new Date(),
  },
]);

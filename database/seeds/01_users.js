exports.seed = async knex => knex('user_credentials').insert([
  {
    id: 1, email: 'user1@gmail.com', username: 'username1', password: 'passs', is_active: true, is_employee: true,
  },
  {
    id: 2, email: 'user2@gmail.com', username: 'username2', password: 'passs', is_active: false, is_employee: true,
  },
  {
    id: 3, email: 'user3@gmail.com', username: 'username3', password: 'passs', is_active: true, is_employee: false,
  },
  {
    id: 4, email: 'user4@gmail.com', username: 'username4', password: 'passs', is_active: false, is_employee: false,
  },
  {
    id: 5, email: 'user5@gmail.com', username: 'username5', password: 'passs', is_active: true, is_employee: true,
  },
]);

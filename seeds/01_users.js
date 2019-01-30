exports.seed = async knex => knex('user_credentials').insert([
  {
    id: 1, email: 'user1@gmail.com', password: 'passs', isActive: true, isEmployee: true,
  },
  {
    id: 2, email: 'user2@gmail.com', password: 'passs', isActive: false, isEmployee: true,
  },
  {
    id: 3, email: 'user3@gmail.com', password: 'passs', isActive: true, isEmployee: false,
  },
  {
    id: 4, email: 'user4@gmail.com', password: 'passs', isActive: false, isEmployee: false,
  },
  {
    id: 5, email: 'user5@gmail.com', password: 'passs', isActive: true, isEmployee: true,
  },
]);

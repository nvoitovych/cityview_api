exports.seed = knex => knex('account').insert([
  {
    id: 1, user_id: 1, name: 'name1', surname: 'surname1', avatar_url: 'photo_url1',
  },
  {
    id: 2, user_id: 2, name: 'name2', surname: 'surname2', avatar_url: 'photo_url2',
  },
  {
    id: 3, user_id: 3, name: 'name3', surname: 'surname3', avatar_url: 'photo_url3',
  },
  {
    id: 4, user_id: 4, name: 'name4', surname: 'surname4', avatar_url: 'photo_url4',
  },
  {
    id: 5, user_id: 5, name: 'name5', surname: 'surname5', avatar_url: 'photo_url5',
  },
]);

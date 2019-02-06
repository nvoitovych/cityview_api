
exports.seed = async (knex) => {
  const views = await knex('city_view')
    .del()
    .catch((err) => {
      console.log('\nError del view: ', err.message);
    });

  if (typeof views === 'undefined') {
    return;
  }

  const account = await knex('account')
    .del()
    .catch((err) => {
      console.log('\nError del account: ', err.message);
    });

  if (typeof account === 'undefined') {
    return;
  }

  await knex('user_credentials')
    .del()
    .catch((err) => {
      console.log('\nError del user_credentials: ', err.message);
    });
};

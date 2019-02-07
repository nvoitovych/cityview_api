const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');


const accountFindById = async (accountId) => {
  const resultAccountArray = await knex('account').where({ id: accountId }).limit(1);
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const userFindById = async (userId) => {
  const resultUserArray = await knex('user_credentials').where({ id: userId }).limit(1);
  if (typeof resultUserArray !== 'undefined' && resultUserArray.length > 0) {
    return mapper.user.one.toJson(resultUserArray[0]);
  }
  const error = new Error("User doesn't exist");
  error.code = 'USER_NOT_FOUND';
  throw error;
};

const userFindByEmail = async (userEmail) => {
  const resultUserArray = await knex('user_credentials').where({ email: userEmail }).limit(1);
  if (typeof resultUserArray !== 'undefined' && resultUserArray.length > 0) {
    return mapper.user.one.toJson(resultUserArray[0]);
  }
  const error = new Error("User doesn't exist");
  error.code = 'USER_NOT_FOUND';
  throw error;
};

const accountFindOneByUserId = async (userId) => {
  const resultAccountArray = await knex('account').where({ user_id: userId }).limit(1);
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const createUserAndAccount = async (email, password) => knex.transaction(t => knex('user_credentials')
  .transacting(t)
  .insert({ email, password })
  .returning('id')
  .then(userId => knex('account')
    .transacting(t)
    .insert({ user_id: userId }))
  .then(t.commit)
  .catch(t.rollback))
  .then(userId => userId)
  .catch((error) => {
    throw error;
  });

const accountFind = async () => mapper.account.many.toJson(await knex('account').select('*'));
const userFind = async () => mapper.user.many.toJson(await knex('user_credentials').select('*'));


module.exports = {
  user: {
    find: userFind,
    findById: userFindById,
    findByEmail: userFindByEmail,
    create: createUserAndAccount,
  },
  account: {
    find: accountFind,
    findById: accountFindById,
    findOneByUserId: accountFindOneByUserId,
  },
};

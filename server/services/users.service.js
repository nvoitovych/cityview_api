/* eslint-disable max-len */
const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');


const accountFindById = async (accountId) => {
  const resultAccountArray = await knex('account').where({ id: accountId }).limit(1);
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const userFindById = async (userId) => {
  const resultUserArray = await knex('user_credentials').where({ id: userId }).limit(1);
  if (typeof resultUserArray === 'undefined' || resultUserArray.length === 0) {
    const error = new Error("User doesn't exist");
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return mapper.user.one.toJson(resultUserArray[0]);
};

const userFindByEmail = async (userEmail) => {
  const resultUserArray = await knex('user_credentials').where({ email: userEmail }).limit(1);
  if (typeof resultUserArray === 'undefined' || resultUserArray.length === 0) {
    const error = new Error("User doesn't exist");
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return mapper.user.one.toJson(resultUserArray[0]);
};

const userUpdate = async ({
  id, email, password, username, isEmployee, isActive,
}) => {
  const resultUser = await knex('user_credentials').where({ id }).update({
    email, password, username, is_employee: isEmployee, is_active: isActive,
  }).catch((error) => {
    throw error;
  });
  return resultUser;
};

const accountFindOneByUserId = async (userId) => {
  const resultAccountArray = await knex('account').where({ user_id: userId }).limit(1);
  if (typeof resultAccountArray === 'undefined' || resultAccountArray.length === 0) {
    const error = new Error("Account doesn't exist");
    error.code = 'ACCOUNT_NOT_FOUND';
    throw error;
  }
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const accountFind = async () => mapper.account.many.toJson(await knex('account').select('*'));
const userFind = async () => mapper.user.many.toJson(await knex('user_credentials').select('*'));


module.exports = {
  user: {
    find: userFind,
    findById: userFindById,
    findByEmail: userFindByEmail,
    update: userUpdate,
  },
  account: {
    find: accountFind,
    findById: accountFindById,
    findOneByUserId: accountFindOneByUserId,
  },
};

/* eslint-disable max-len */
const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');


const accountFindById = async (accountId) => {
  const resultAccountArray = await knex('account').where({ id: accountId }).limit(1).limit(1)
    .catch((error) => {
      throw error;
    });
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const userFindById = async (userId) => {
  const resultUserArray = await knex('user_credentials').where({ id: userId }).limit(1)
    .catch((error) => {
      throw error;
    });
  if (typeof resultUserArray === 'undefined' || resultUserArray.length === 0) {
    const error = new Error('User doesn\'t exist');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return mapper.user.one.toJson(resultUserArray[0]);
};

// use to find by unique fields
const userFindOne = async ({
  facebookId, googleId, email, userId,
}) => {
  const baseQuery = knex('user_credentials');
  const filterByUniqueField = (base, field, value) => base.where(field, value);
  let uniqueFilterFieldName;
  let value;
  if (typeof facebookId !== 'undefined') {
    uniqueFilterFieldName = 'facebook_id';
    value = facebookId;
  }
  if (typeof googleId !== 'undefined') {
    uniqueFilterFieldName = 'google_id';
    value = googleId;
  }
  if (typeof email !== 'undefined') {
    uniqueFilterFieldName = 'email';
    value = email;
  }
  if (typeof id !== 'undefined') {
    uniqueFilterFieldName = 'id';
    value = userId;
  }

  if (typeof uniqueFilterFieldName === 'undefined' || typeof value === 'undefined') {
    const error = new Error('Invalid parameters were passed');
    error.code = 'INVALID_PARAMETERS';
    throw error;
  }

  const resultUser = await filterByUniqueField(baseQuery, uniqueFilterFieldName, value).first()
    // returns only one row
    .catch((error) => {
      throw error;
    });

  if (typeof resultUser === 'undefined') {
    return null;
  }
  return mapper.user.one.toJson(resultUser);
};


const userFindByEmail = async (userEmail) => {
  const resultUserArray = await knex('user_credentials').where({ email: userEmail }).limit(1)
    .catch((error) => {
      throw error;
    });
  if (typeof resultUserArray === 'undefined' || resultUserArray.length === 0) {
    const error = new Error('User doesn\'t exist');
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

const userUpdateByEmail = async ({
  email, password, username, isEmployee, isActive,
}) => {
  const resultUser = await knex('user_credentials').where({ email }).update({
    email, password, username, is_employee: isEmployee, is_active: isActive,
  }).catch((error) => {
    throw error;
  });
  return resultUser;
};

const accountFindOneByUserId = async (userId) => {
  const resultAccountArray = await knex('account').where({ user_id: userId }).limit(1)
    .catch((error) => {
      throw error;
    });
  if (typeof resultAccountArray === 'undefined' || resultAccountArray.length === 0) {
    const error = new Error('Account doesn\'t exist');
    error.code = 'ACCOUNT_NOT_FOUND';
    throw error;
  }
  return mapper.account.one.toJson(resultAccountArray[0]);
};

const accountFind = async () => mapper.account.many.toJson(await knex('account').select('*').catch((error) => {
  throw error;
}));
const userFind = async () => mapper.user.many.toJson(await knex('user_credentials').select('*').catch((error) => {
  throw error;
}));

const createUserAndAccount = async ({
  googleId, facebookId, avatarUrl,
  email, password, username, isEmployee, isActive,
}) => {
  if (typeof googleId === 'undefined' && typeof facebookId === 'undefined'
    && (typeof email === 'undefined' || typeof password === 'undefined')) {
    const error = new Error('Invalid parameters were passed');
    error.code = 'INVALID_PARAMETERS';
    throw error;
  }
  const result = await knex.transaction(async (trx) => {
    const userIds = await trx('user_credentials')
      .insert({
        google_id: googleId || null,
        facebook_id: facebookId || null,
        email: email || null,
        password: password || null,
        username: username || null,
        is_active: isActive,
        is_employee: isEmployee,
        created_at: new Date(),
      })
      .returning('id') // returns an array of ids
      .catch(async (error) => {
        await trx.rollback(error);
        throw error;
      });
    await trx('account')
      .insert({ user_id: userIds[0], avatar_url: avatarUrl })
      .into('account')
      .returning('user_id') // returns an array of ids
      .catch(async (error) => {
        await trx.rollback(error);
        throw error;
      });
    await trx.commit(userIds[0]);
  }).catch((error) => {
    throw error;
  });
  return result;
};

// TODO: fix if user is deleted his cityViews should be deleted also/
const deleteUserCredentialsAndAccount = async (userId) => {
  const result = await knex.transaction(async (trx) => {
    const userIds = await trx('account')
      .where({ user_id: userId })
      .del()
      .returning('user_id') // returns an array of ids
      .catch(async (error) => {
        await trx.rollback(error);
        throw error;
      });
    await trx('user_credentials')
      .del()
      .where({ id: userId })
      .returning('id') // returns an array of ids
      .catch(async (error) => {
        await trx.rollback(error);
        throw error;
      });
    await trx.commit(userIds[0]);
  }).catch((error) => {
    throw error;
  });
  return result;
};


module.exports = {
  user: {
    find: userFind,
    findOne: userFindOne,
    findById: userFindById,
    findByEmail: userFindByEmail,
    updateById: userUpdate,
    updateByEmail: userUpdateByEmail,
    create: createUserAndAccount,
    delete: deleteUserCredentialsAndAccount,
  },
  account: {
    find: accountFind,
    findById: accountFindById,
    findOneByUserId: accountFindOneByUserId,
  },
};

const express = require('express');
const {
  getPublicAccountList, getPrivateAccountDetail,
  getPublicAccountDetail, deleteAccount,
  // updateUserProfile,
} = require('./users.controller');
const {
  validateId,
  // validateUpdateUserProfile,
} = require('./users.validator');


const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.get('/', getPublicAccountList);
publicRouter.get('/:userId', validateId, getPublicAccountDetail);

privateRouter.delete('/me', deleteAccount);
privateRouter.get('/me', getPrivateAccountDetail);
// privateRouter.patch('/me', validateUpdateUserProfile, updateUserProfile);


module.exports = {
  publicRouter,
  privateRouter,
};

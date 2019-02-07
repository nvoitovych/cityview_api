const express = require('express');
const { getAccountDetail } = require('./users.controller');


const privateRouter = express.Router();

privateRouter.get('my-profile', getAccountDetail);


module.exports = {
  privateRouter,
};

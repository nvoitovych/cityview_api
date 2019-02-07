const express = require('express');
const { getCityViewList, getCityViewDetail, createCityView } = require('./city-views.controller');
const { validateId, validateBody } = require('./city-views.validator');


const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.get('/', getCityViewList);
publicRouter.get('/:id', validateId, getCityViewDetail);

privateRouter.post('/', validateBody, createCityView);

module.exports = {
  publicRouter,
  privateRouter,
};

const express = require('express');
const {
  getCityViewList, getCityViewDetail, createCityView, deleteCityView, updateCityView,
} = require('./city-views.controller');
const {
  validateId, validateCityViewImage, validateCityView,
  validateUpdateCityView, validateUpdateCityViewImage,
} = require('./city-views.validator');


const publicRouter = express.Router();
const privateRouter = express.Router();

// TODO: add e2e tests for all endpoints
publicRouter.get('/', getCityViewList);
publicRouter.get('/:id', validateId, getCityViewDetail);

privateRouter.post('/', validateCityView, validateCityViewImage, createCityView);
privateRouter.patch('/:id', validateId, validateUpdateCityView, validateUpdateCityViewImage, updateCityView);
privateRouter.delete('/:id', validateId, deleteCityView);


module.exports = {
  publicRouter,
  privateRouter,
};

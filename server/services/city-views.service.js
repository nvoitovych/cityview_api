/* eslint-disable max-len */
const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');


const cityViewFindById = async (id) => {
  const resultCityViewArray = await knex('city_view').where({ id });
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.one.toJson(resultCityViewArray[0]);
  }
  return null;
};

const cityViewFindAll = async () => {
  const resultCityViewArray = await knex('city_view').select('*');
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.many.toJson(resultCityViewArray);
  }
  return [];
};

const createOneCityView = async ({
  userId, name, description, latitude, longitude, yearOfOrigin, status, createdAt, street, city, region, country,
}) => knex('city_view')
  .insert({
    user_id: userId,
    name,
    description,
    latitude,
    longitude,
    year_of_origin: yearOfOrigin,
    status,
    created_at: createdAt,
    street,
    city,
    region,
    country,
  })
  .returning('id');


module.exports = {
  cityView: {
    findAll: cityViewFindAll,
    findById: cityViewFindById,
    createOne: createOneCityView,
  },
};

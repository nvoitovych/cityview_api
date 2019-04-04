const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');


const cityViewFindById = async (id) => {
  const resultCityViewArray = await knex('city_view')
    .where({ id })
    .catch((error) => {
      throw error;
    });
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.one.toJson(resultCityViewArray[0]);
  }
  return null;
};

const cityViewDeleteById = async (cityViewId) => {
  const deletedCityView = await knex('city_view')
    .where({ id: cityViewId })
    .del()
    .returning('*')
    .catch((error) => {
      throw error;
    });

  return deletedCityView;
};

const cityViewFindAll = async () => {
  const resultCityViewArray = await knex('city_view')
    .select('*')
    .catch((error) => {
      throw error;
    });
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.many.toJson(resultCityViewArray);
  }
  return [];
};

const createOneCityView = async ({
  userId, name, description, latitude, longitude, yearOfOrigin,
  status, createdAt, street, city, region, country, imageURL,
}) => knex('city_view')
  .insert({
    user_id: userId,
    name,
    description,
    latitude,
    longitude,
    year_of_origin: yearOfOrigin,
    photo_url: imageURL,
    status,
    created_at: createdAt,
    street,
    city,
    region,
    country,
  })
  .returning('id')
  .catch((error) => {
    throw error;
  });

const cityViewUpdateById = async ({
  cityViewId, name, description, latitude, longitude, yearOfOrigin,
  status, street, city, region, country, imageURL,
}) => {
  const updatedCityView = await knex('city_view')
    .where({ id: cityViewId })
    .update({
      name,
      description,
      latitude,
      longitude,
      year_of_origin: yearOfOrigin,
      status,
      street,
      city,
      region,
      country,
      photo_url: imageURL,
    })
    .returning('id')
    .catch((error) => {
      throw error;
    });
  if (!updatedCityView) return null;

  return { success: true };
};


module.exports = {
  cityView: {
    update: cityViewUpdateById,
    delete: cityViewDeleteById,
    findAll: cityViewFindAll,
    findById: cityViewFindById,
    createOne: createOneCityView,
  },
};

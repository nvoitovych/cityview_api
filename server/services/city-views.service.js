const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');
const { googleMapsClient } = require('../../config/google-places-setup');


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
  status, createdAt, streetNumber, street, city, region, district, country, imageURL,
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
    street_number: streetNumber,
    street,
    city,
    region,
    district,
    country,
  })
  .returning('id')
  .catch((error) => {
    throw error;
  });

const cityViewUpdateById = async ({
  cityViewId, name, description, latitude, longitude, yearOfOrigin,
  status, streetNumber, street, city, region, district, country, imageURL,
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
      street_number: streetNumber,
      street,
      city,
      region,
      district,
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

const reverseGeo = async ({ latitude, longitude }) => {
  const result = await googleMapsClient
    .reverseGeocode({ latlng: [latitude, longitude].join(', '), language: 'uk' })
    .asPromise();

  if (typeof result === 'undefined' || typeof result.status === 'undefined'
    || result.status !== 200 || typeof result.json.results === 'undefined'
    || result.json.status !== 'OK') {
    const error = Error();
    throw error;
  }

  let streetNumber;
  let street;
  let city;
  let region;
  let district;
  let country;

  if (Array.isArray(result.json.results) && result.json.results.length) {
    const addressComponents = result.json.results[0].address_components;
    if (Array.isArray(addressComponents) && addressComponents.length) {
      addressComponents.forEach((component) => {
        switch (component.types[0]) {
          case 'street_number': {
            streetNumber = component.long_name;
            break;
          }
          case 'route': {
            street = component.long_name;
            break;
          }
          case 'locality': {
            city = component.long_name;
            break;
          }
          case 'administrative_area_level_1': {
            region = component.long_name;
            break;
          }
          case 'administrative_area_level_2': {
            district = component.long_name;
            break;
          }
          case 'country': {
            country = component.long_name;
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  } else {
    const error = Error();
    throw error;
  }

  return {
    streetNumber, street, city, region, district, country,
  };
};


module.exports = {
  cityView: {
    update: cityViewUpdateById,
    delete: cityViewDeleteById,
    findAll: cityViewFindAll,
    findById: cityViewFindById,
    createOne: createOneCityView,
  },
  reverseGeo,
};

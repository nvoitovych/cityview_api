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


module.exports = {
  cityView: {
    findAll: cityViewFindAll,
    findById: cityViewFindById,
  },
};

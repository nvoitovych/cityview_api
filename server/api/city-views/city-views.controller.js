const { cityView } = require('../../services/city-views.service');


const getCityViewList = async (req, res) => {
  const resultCityViews = await cityView.findAll()
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  res.status(200).send(resultCityViews);
};

const getCityViewDetail = async (req, res) => {
  const { cityViewId } = req.app.locals;
  const resultCityViews = await cityView.findById(cityViewId)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  res.status(200).send(resultCityViews);
};

// TODO: add extracting address from latitude, longitude(with google places API)
// TODO: add photo saving in google storage
const createCityView = async (req, res) => {
  const { cityViewObj } = req.app.locals;
  const street = '';
  const city = '';
  const region = '';
  const country = '';
  const mappedCityViewObj = {
    ...cityViewObj, status: 'processing', street, city, region, country, createdAt: new Date(),
  };

  const resultCityViews = await cityView.createOne(mappedCityViewObj)
    .catch((error) => {
      // Error depends on DB driver(MySQL, PostgreSQL, etc.)
      // ER_NO_REFERENCED_ROW_2 -- it`s error from MySQL
      // on trying to add city_view with user_id which doesn`t exist
      switch (error.code) {
        case 'ER_NO_REFERENCED_ROW_2': {
          res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'Token is invalid. There is no user with this token' });
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  res.status(200).send({ success: true });
};


module.exports = {
  getCityViewList,
  createCityView,
  getCityViewDetail,
};

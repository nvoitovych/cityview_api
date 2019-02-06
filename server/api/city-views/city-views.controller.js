const { cityView } = require('../../services/city-views.service');


exports.getCityViewList = async (req, res) => {
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

exports.getCityViewDetail = async (req, res) => {
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

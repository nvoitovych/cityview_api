const { cityView } = require('../../services/city-views.service');


exports.getCityViewList = async (req, res) => {
  const resultCityViews = await cityView.findAll();
  res.status(200).send(resultCityViews);
};

exports.getCityViewDetail = async (req, res) => {
  const cityViewId = req.params.id;
  const resultCityViews = await cityView.findById(cityViewId);
  res.status(200).send(resultCityViews);
};

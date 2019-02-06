const Joi = require('joi');

const validateCityViewIdInURL = async (req, res, next) => {
  const cityViewId = parseInt(req.params.id, 10);

  const cityViewIdSchema = Joi.number().min(1).required();
  const cityViewIdValidationResult = Joi.validate(cityViewId, cityViewIdSchema);

  if (cityViewIdValidationResult.error) {
    res.status(400).send(({ errorCode: 400, errorStatus: 'BAD_REQUEST', errorMessage: 'Invalid city view id in URL parameters' }));
  } else {
    req.app.locals.cityViewId = cityViewId;
    next();
  }
};

module.exports = {
  validateId: validateCityViewIdInURL,
};

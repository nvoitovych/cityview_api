const Joi = require('joi');


const validateCityViewIdInURL = (req, res, next) => {
  const cityViewId = parseInt(req.params.id, 10);

  const cityViewIdSchema = Joi.number().min(1).required();
  const cityViewIdValidationResult = Joi.validate(cityViewId, cityViewIdSchema);

  if (cityViewIdValidationResult.error) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid city view id in URL parameters' });
    return;
  }

  req.cityViewId = req.params.id;
  next();
};

module.exports = {
  validateId: validateCityViewIdInURL,
};

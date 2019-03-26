/* eslint-disable max-len */
const Joi = require('joi');


const validateCityViewIdInURL = async (req, res, next) => {
  const cityViewId = parseInt(req.params.id, 10);

  const cityViewIdSchema = Joi.number().min(1).required();
  const cityViewIdValidationResult = await Joi.validate(cityViewId, cityViewIdSchema).catch((error) => {
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid city view id in URL' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof cityViewIdValidationResult === 'undefined') return;

  req.app.locals.cityViewId = cityViewId;
  next();
};

// TODO: add photo validation
const validateCityViewReqBody = async (req, res, next) => {
  const cityView = {
    name: req.body.name,
    description: req.body.description,
    userId: parseInt(req.app.locals.userId, 10),
    latitude: parseFloat(req.body.latitude).toFixed(5),
    longitude: parseFloat(req.body.longitude).toFixed(5),
    yearOfOrigin: parseInt(req.body.yearOfOrigin, 10),
  };
  const now = new Date();
  const cityViewObjSchema = Joi.object().keys({
    latitude: Joi.number().min(-180).max(180).precision(5)
      .strict()
      .required(),
    longitude: Joi.number().min(-90).max(90).precision(5)
      .strict()
      .required(),
    name: Joi.string().min(2).max(50).strict()
      .required(),
    description: Joi.string().min(0).max(250).strict(),
    yearOfOrigin: Joi.number().integer().min(1750).max(now.getFullYear())
      .strict()
      .required(),
    userId: Joi.number().integer().min(0).strict()
      .required(),
  }).required();

  const cityViewValidationResult = await Joi.validate(cityView, cityViewObjSchema).catch((error) => {
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid city view parameters' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof cityViewValidationResult === 'undefined') return;

  req.app.locals.cityViewObj = cityView;
  next();
};


module.exports = {
  validateId: validateCityViewIdInURL,
  validateBody: validateCityViewReqBody,
};

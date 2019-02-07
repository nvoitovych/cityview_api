/* eslint-disable max-len */
const Joi = require('joi');

const validateAuthReqBody = async (req, res, next) => {
  const { email, password } = req.body;

  const emailSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  });
  const passwordSchema = Joi.object().keys({
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  });

  const emailValidationResult = await Joi.validate({ email }, emailSchema).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });

  const passwordValidationResult = await Joi.validate({ password }, passwordSchema).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });

  if (emailValidationResult.error) {
    if (passwordValidationResult.error) res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email and password' });
    else res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email' });
  } else if (passwordValidationResult.error) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid password' });
  } else {
    req.app.locals.email = email;
    req.app.locals.password = password;
    next();
  }
};

module.exports = {
  validateAuthReqBody,
};

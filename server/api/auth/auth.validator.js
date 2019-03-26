/* eslint-disable max-len */
const Joi = require('joi');


// const validateAuthReqBody = async (req, res, next) => {
//   const { email, password } = req.body;
//
//   const emailSchema = Joi.object().keys({
//     email: Joi.string().email({ minDomainAtoms: 2 }).required(),
//   });
//   const passwordSchema = Joi.object().keys({
//     password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
//   });
//
//   const emailValidationResult = await Joi.validate({ email }, emailSchema).catch((error) => {
//     switch (error.name) {
//       case 'ValidationError': {
//         res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email' }));
//         break;
//       }
//       default: {
//         res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
//         break;
//       }
//     }
//   });
//   if (typeof emailValidationResult === 'undefined') return;
//
//   const passwordValidationResult = await Joi.validate({ password }, passwordSchema).catch((error) => {
//     switch (error.name) {
//       case 'ValidationError': {
//         res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid password' }));
//         break;
//       }
//       default: {
//         res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
//         break;
//       }
//     }
//   });
//   if (typeof passwordValidationResult === 'undefined') return;
//
//   req.app.locals.email = email;
//   req.app.locals.password = password;
//   next();
// };

const validatePassword = async (req, res, next) => {
  const { password } = req.body;

  const passwordSchema = Joi.object().keys({
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  });

  const passwordValidationResult = await Joi.validate({ password }, passwordSchema).catch((error) => {
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid password' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof passwordValidationResult === 'undefined') return;

  req.app.locals.password = password;
  next();
};

const validateEmail = async (req, res, next) => {
  const { email } = req.body;

  const emailSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  });

  const emailValidationResult = await Joi.validate({ email }, emailSchema).catch((error) => {
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof emailValidationResult === 'undefined') return;

  req.app.locals.email = email;
  next();
};

const validateEmailConfirmationToken = async (req, res, next) => {
  const confirmationToken = req.query.token;
  const confirmationTokenInt = parseInt(confirmationToken, 16);
  if (confirmationTokenInt === 'NaN') {
    res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email confirmation token' }));
    return;
  }

  const emailConfirmationTokenSchema = Joi.object().keys({
    confirmationToken: Joi.string().required(),
  });

  const tokenValidationResult = await Joi.validate({ confirmationToken }, emailConfirmationTokenSchema).catch((error) => {
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email confirmation token' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof tokenValidationResult === 'undefined') return;

  req.app.locals.confirmationToken = confirmationToken;
  next();
};

const validatePasswordResetCode = async (req, res, next) => {
  const code = parseInt(req.body.code, 10);

  const codeSchema = Joi.number().min(0).max(999999).required();

  const codeValidationResult = await Joi.validate(code, codeSchema).catch((error) => {
    console.error('codeValidationResult | error: ', error);
    switch (error.name) {
      case 'ValidationError': {
        res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid reset password code' }));
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof codeValidationResult === 'undefined') return;

  req.app.locals.code = code;
  next();
};


module.exports = {
  validateEmail,
  validatePassword,
  validateEmailConfirmationToken,
  validatePasswordResetCode,
};

const Joi = require('joi');


const validateCityViewIdInURL = async (req, res, next) => {
  const userIdInURL = parseInt(req.params.userId, 10);

  const userIdSchema = Joi.number().min(1).required();
  const cityViewIdValidationResult = await Joi.validate(userIdInURL, userIdSchema)
    .catch((error) => {
      switch (error.name) {
        case 'ValidationError': {
          res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid user id in URL' }));
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof cityViewIdValidationResult === 'undefined') return;

  req.app.locals.userIdInURL = userIdInURL;
  next();
};

// const validateUpdateUserProfileReqBody = async (req, res, next) => {
//   const account = {
//
//   };
//
//   const userCredentials = {
//
//   };
//
//   const userProfile = {
//     name: req.body.name || undefined,
//     description: req.body.description || undefined,
//     userId: parseInt(req.app.locals.userId, 10),
//     latitude: parseFloat(parseFloat(req.body.latitude).toFixed(5)) || undefined,
//     longitude: parseFloat(parseFloat(req.body.longitude).toFixed(5)) || undefined,
//     yearOfOrigin: parseInt(req.body.yearOfOrigin, 10) || undefined,
//   };
//
//   const now = new Date();
//   const userProfileObjSchema = Joi.object().keys({
//     latitude: Joi.number().min(-180).max(180).precision(5)
//       .strict()
//       .optional(),
//     longitude: Joi.number().min(-90).max(90).precision(5)
//       .strict()
//       .optional(),
//     name: Joi.string().min(2).max(50).strict()
//       .optional(),
//     description: Joi.string().min(0).max(250).strict(),
//     yearOfOrigin: Joi.number().integer().min(1750).max(now.getFullYear())
//       .strict()
//       .optional(),
//     userId: Joi.number().integer().min(0).strict()
//       .required(),
//   }).optional();
//
//   const userProfileValidationResult = await Joi.validate(userProfile, userProfileObjSchema)
//     .catch((error) => {
//       console.error('userProfileValidationResult | error: ', error);
//       switch (error.name) {
//         case 'ValidationError': {
//           res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid user profile parameter(s)' }));
//           break;
//         }
//         default: {
//           res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
//           break;
//         }
//       }
//     });
//   if (typeof userProfileValidationResult === 'undefined') return;
//
//   req.app.locals.userProfile = userProfile;
//   next();
// };


module.exports = {
  // validateUpdateUserProfile: validateUpdateUserProfileReqBody,
  validateId: validateCityViewIdInURL,
};

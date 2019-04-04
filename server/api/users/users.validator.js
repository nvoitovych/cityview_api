const Joi = require('joi');


const VALID_MIMETYPE = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];

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

const validateUpdateUserProfileReqBody = async (req, res, next) => {
  const accountObj = {
    name: req.body.name,
    surname: req.body.surname,
  };

  const userCredentialsObj = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    facebookId: req.body.facebookId,
    googleId: req.body.googleId,
  };

  const userProfile = { ...accountObj, ...userCredentialsObj };

  const userProfileObjSchema = Joi.object().keys({
    facebookId: Joi.string().min(2).max(100).strict()
      .optional(),
    googleId: Joi.string().min(2).max(100).strict()
      .optional(),
    userId: Joi.number().integer().min(0).strict()
      .optional(),
    email: Joi.string().email({ minDomainAtoms: 2 })
      .optional(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .optional(),
    name: Joi.string().min(2).max(50).strict()
      .optional(),
    surname: Joi.string().min(2).max(50).strict()
      .optional(),
    username: Joi.string().min(2).max(50).strict()
      .optional(),
  });

  const userProfileValidationResult = await Joi.validate(userProfile, userProfileObjSchema)
    .catch((error) => {
      console.error('userProfileValidationResult | error: ', error);
      switch (error.name) {
        case 'ValidationError': {
          res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: 'Invalid user profile parameter(s)' }));
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof userProfileValidationResult === 'undefined') return;

  req.app.locals.userProfile = userProfile;
  next();
};

const validateUpdateAvatarImage = async (req, res, next) => {
  if (typeof req.files !== 'undefined' && req.files !== null && req.files.avatarFile) {
    if (VALID_MIMETYPE.includes(req.files.avatarFile.mimetype) === false) {
      res.status(400).send(({ code: 400, status: 'BAD_REQUEST', message: `File should be one of [ ${VALID_MIMETYPE} ] mimetype` }));
      return;
    }
    req.app.locals.avatarFile = req.files.avatarFile;
  }

  next();
};


module.exports = {
  validateUpdateUserProfile: validateUpdateUserProfileReqBody,
  validateId: validateCityViewIdInURL,
  validateUpdateAvatarImage,
};

const BlueBird = require('bluebird');
const bcrypt = require('bcrypt');
const jwt = BlueBird.promisifyAll(require('jsonwebtoken'));

const { user } = require('../../services/users.service');
const {
  generateEmailConfirmationToken, decodeEmailConfirmationToken,
  sendEmailConfirmationToken, createUserAndAccount,
  generateRandomCode, sendResetPasswordCode,
  savePasswordResetCode, getPasswordResetCodeByEmail,
} = require('../../services/auth.service');

const { TOKEN_SECRET } = process.env;


const registerUser = async (req, res) => {
  const { email, password } = req.app.locals;

  const hashedPassword = await bcrypt.hash(password, 10).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof hashedPassword === 'undefined') return;

  // return single user_credentials id
  const resultUser = await createUserAndAccount({
    email, password: hashedPassword, username: null, isEmployee: false, isActive: false,
  }).catch((error) => {
    switch (error.code) {
      case 'ER_DUP_ENTRY': {
        res.status(409).send({ code: 409, status: 'CONFLICT', message: 'User already exists' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  const generatedToken = await generateEmailConfirmationToken(resultUser).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof generatedToken === 'undefined') return;

  const sendingResult = await sendEmailConfirmationToken(generatedToken, email).catch((error) => {
    console.error(`Error during email sending: ${error}`);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof sendingResult === 'undefined') return;

  res.status(200).send({ success: true }); // user is registered AND confirmation mail is sent
};

const loginUser = async (req, res) => {
  const { email, password } = req.app.locals;

  const resultUser = await user.findByEmail(email).catch((error) => {
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'There is no User with this email' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  const isPasswordValid = await bcrypt.compare(password, resultUser.password).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof isPasswordValid === 'undefined') return;

  if (!isPasswordValid) {
    res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'Wrong password' });
    return;
  }

  if (!resultUser.isActive) {
    res.status(403).send({ code: 403, status: 'FORBIDDEN', message: 'Email not confirmed' });
    return;
  }

  const token = await jwt
    .signAsync({
      id: resultUser.id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    }, TOKEN_SECRET)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof token === 'undefined') return;

  res.status(200).send({ token });
};

const confirmEmail = async (req, res) => {
  const { confirmationToken } = req.app.locals;

  const decodedConfirmationToken = await decodeEmailConfirmationToken(confirmationToken)
    .catch((error) => {
      console.error('decodedConfirmationToken | error: ', error);
      switch (error.code) {
        case 'TOKEN_EXPIRED_ERROR': {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Confirmation token is expired' });
          break;
        }
        case 'JSON_WEB_TOKEN_ERROR': {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email confirmation token' });
          break;
        }
        case 'TOKEN_IS_MALFORMED': {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Confirmation token is malformed' });
          break;
        }
        case 'JWE_DEFAULT_ERROR': {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Confirmation token is not valid' });
          break;
        }
        case 'ALGORITHM_NOT_ALLOWED': {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Confirmation token is not valid' });
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        }
      }
    });
  if (typeof decodedConfirmationToken === 'undefined') {
    return;
  }

  const resultUser = await user.findById(decodedConfirmationToken.id).catch((error) => {
    console.error('resultUser | error: ', error);

    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid email confirmation token' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  if (resultUser.isActive) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'User email had been already confirmed' });
    return;
  }
  resultUser.isActive = true;
  const updatedUser = await user.updateById(resultUser).catch((error) => {
    console.error('updatedUser | error: ', error);

    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof updatedUser === 'undefined') return;

  const token = await jwt
    .signAsync({
      id: resultUser.id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    }, TOKEN_SECRET)
    .catch((error) => {
      console.error('token | error: ', error);

      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof token === 'undefined') return;

  res.status(200).send({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.app.locals;

  const resultUser = await user.findByEmail(email).catch((error) => {
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'There is no User with this email' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  if (!resultUser.isActive) {
    res.status(403).send({ code: 403, status: 'FORBIDDEN', message: 'Email not confirmed' });
    return;
  }

  const generatedCode = await generateRandomCode(0, 999999).catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof generatedCode === 'undefined') return;

  const codeSavingResult = await savePasswordResetCode(generatedCode, email).catch((error) => {
    console.error(`Error during password reset code saving in Redis: ${error}`);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof codeSavingResult === 'undefined') return;

  const sendingResult = await sendResetPasswordCode(generatedCode, email).catch((error) => {
    console.error(`Error during email sending: ${error}`);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof sendingResult === 'undefined') return;

  res.status(200).send({ success: true }); // reset password token is send
};

const resendEmailConfirmationToken = async (req, res) => {
  const { email } = req.app.locals;

  const resultUser = await user.findByEmail(email).catch((error) => {
    console.error('resultUser | error: ', error);
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'User email is not found in system' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  if (resultUser.isActive) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'User email had been already confirmed' });
    return;
  }

  const generatedToken = await generateEmailConfirmationToken(resultUser.id).catch((error) => {
    console.error('generatedToken | error: ', error);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof generatedToken === 'undefined') return;

  const sendingResult = await sendEmailConfirmationToken(generatedToken, email).catch((error) => {
    console.error(`Error during email sending: ${error}`);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof sendingResult === 'undefined') return;

  res.status(200).send({ success: true }); // user is registered AND confirmation mail is sent
};

const resetForgottenPassword = async (req, res) => {
  const { email, code, password } = req.app.locals;
  const cachedCode = await getPasswordResetCodeByEmail(email).catch((error) => {
    console.error(`Error during password reset code saving in Redis: ${error}`);
    switch (error.code) {
      case 'CODE_NOT_FOUND': {
        res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Code is expired' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof cachedCode === 'undefined') return;

  if (code !== cachedCode) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid code' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10).catch((error) => {
    console.error('hashedPassword | error: ', error);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof hashedPassword === 'undefined') return;

  const resultUser = await user.updateByEmail({ email, password: hashedPassword })
    .catch((error) => {
      console.error('resultUser | error: ', error);
      switch (error.code) {
        case 'ER_DUP_ENTRY': {
          res.status(409).send({ code: 409, status: 'CONFLICT', message: 'User already exists' });
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultUser === 'undefined') return;

  res.status(200).send({ success: true });
};


module.exports = {
  registerUser,
  loginUser,
  confirmEmail,
  forgotPassword,
  resetForgottenPassword,
  resendEmailConfirmationToken,
};

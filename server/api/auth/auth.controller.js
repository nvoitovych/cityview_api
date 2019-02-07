const BlueBird = require('bluebird');
const bcrypt = require('bcrypt');
const jwt = BlueBird.promisifyAll(require('jsonwebtoken'));
const { user } = require('../../services/users.service');

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

  const resultUser = await user.create(email, hashedPassword).catch((error) => {
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

  const token = await jwt.signAsync({
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


module.exports = {
  registerUser,
  loginUser,
};

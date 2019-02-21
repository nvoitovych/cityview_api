const BlueBird = require('bluebird');
const jwt = BlueBird.promisifyAll(require('jsonwebtoken'));

const { TOKEN_SECRET } = process.env;

// TODO: verifyJWT or validateJWT: rename file or export function
// checks is JWT present in Authorzation header and is it valid
const validateJwt = async (req, res, next) => {
  const authorizationHeaderExists = req.headers.authorization;

  if (!authorizationHeaderExists) {
    res.status(400).send({
      code: 400,
      status: 'BAD_REQUEST',
      message: "Authorization header wasn't found or Auth Header is empty",
    });
    return;
  }

  const token = req.headers.authorization.split(' ')[1]; // example: jwt = 'Bearer token'

  if (!token) {
    res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: "Token wasn't sent" });
  } else {
    const decode = await jwt
      .verifyAsync(token, TOKEN_SECRET)
      .catch((error) => {
        switch (error.name) {
          case 'TokenExpiredError': {
            res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: error.message });
            break;
          }
          case 'JsonWebTokenError': {
            res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: error.message });
            break;
          }
          default: {
            res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          }
        }
      });
    if (typeof decode === 'undefined') return;

    if (typeof decode.id === 'undefined' || !parseInt(decode.id, 10)) {
      res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Token is malformed' });
      return;
    }

    req.app.locals.userId = parseInt(decode.id, 10);
    next();
  }
};


module.exports = {
  validateJwt,
};

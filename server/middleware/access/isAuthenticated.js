const BlueBird = require('bluebird');
const jwt = BlueBird.promisifyAll(require('jsonwebtoken'));

const { TOKEN_SECRET } = process.env;


// check is JWT present in Authorzation header and is it valid
const isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(400).send({
      code: 400,
      status: 'BAD_REQUEST',
      message: 'You must send an Authorization header',
    });
    return;
  }

  const [authType, token] = authorization.trim().split(' ');
  if (authType !== 'Bearer') {
    res.status(400).send({
      code: 400,
      status: 'BAD_REQUEST',
      message: 'Expected a Bearer token',
    });
    return;
  }

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
  isAuthenticated,
};

const bodyParser = require('body-parser');

const addRawBody = (req, res, buf) => {
  req.rawBody = buf.toString();
};

const checkBody = (req, res, next) => {
  bodyParser.json({
    verify: addRawBody,
  })(req, res, (err) => {
    if (err) {
      switch (err.code) {
        default: {
          res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Invalid data sent' });
          break;
        }
      }
    } else {
      next();
    }
  });
};

module.exports.checkBody = checkBody;

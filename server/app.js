const express = require('express');
const bodyParser = require('body-parser');
const publicRouter = require('./router/publicRouter');

const app = express();

const addRawBody = (req, res, buf) => {
  req.rawBody = buf.toString();
};

app.use(bodyParser.urlencoded({ extended: true }));
// check is body valid JSON
app.use((req, res, next) => {
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
});

app.get('/', async (req, res) => {
  res.status(200).send({ result: 'Oh, it`s you? Helllo' });
});
app.use('/public', publicRouter);

module.exports = app;

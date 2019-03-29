require('../config/config-env');
require('../config/passport-google-setup');
require('../config/passport-facebook-setup');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const apiRouter = require('./api/api.router');
const { cors } = require('./middleware/cors');
const { handleError } = require('./middleware/error-handlers/handle-error');
const { handle404Error } = require('./middleware/error-handlers/handle-404');
const { handleInvalidReqBody } = require('./middleware/error-handlers/handle-invalid-req-body');


const app = express();

app.use(passport.initialize());
app.use(cors);
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleInvalidReqBody);
app.use('/', apiRouter);
app.use(handle404Error);
app.use(handleError);


module.exports = app;

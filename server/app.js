require('../config/config-env');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const apiRouter = require('./api/api.router');
const { cors } = require('./middleware/cors');
const { handleError } = require('./middleware/error-handlers/handle-error');
const { handle404Error } = require('./middleware/error-handlers/handle-404');
const { handleInvalidReqBody } = require('./middleware/error-handlers/handle-invalid-req-body');


const app = express();

// TODO: how to combine fileUpload and bodyParser middlwares?
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

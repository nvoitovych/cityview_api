const express = require('express');
const bodyParser = require('body-parser');
const { handleInvalidReqBody } = require('./middleware/error-handlers/handle-invalid-req-body');
const { handleError } = require('./middleware/error-handlers/handle-error');
const { handle404Error } = require('./middleware/error-handlers/handle-404');
const apiRouter = require('./api/api.router');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleInvalidReqBody);
app.use('/', apiRouter);
app.use(handle404Error);
app.use(handleError);


module.exports = app;

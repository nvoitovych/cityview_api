const express = require('express');
const bodyParser = require('body-parser');
const { checkBody } = require('./helpers/utils');
const apiRouter = require('./api/api.router');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkBody); // is body valid JSON

app.get('/', async (req, res) => res.status(200).send({ result: 'Oh, it`s you? Helllo' }));
app.use('/', apiRouter);

module.exports = app;

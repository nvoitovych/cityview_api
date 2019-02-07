const express = require('express');
const privateRouter = require('./private-api.router');
const publicRouter = require('./public-api.router');


const router = express.Router();

router.use('/public', publicRouter);
router.use('/private', privateRouter);


module.exports = router;

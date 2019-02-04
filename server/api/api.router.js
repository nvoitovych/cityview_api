const express = require('express');
const authRouter = require('./auth/auth.router');
const cityViewsRouter = require('./city-views/city-views.router');


const router = express.Router();

router.use('/public/auth', authRouter);
router.use('/public/city-views', cityViewsRouter);


module.exports = router;

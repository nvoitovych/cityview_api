const express = require('express');
const usersRouter = require('./users/users.router');
const cityViewsRouter = require('./city-views/city-views.router');
const { verifyJWT } = require('../middleware/access/verify-jwt');


const router = express.Router();

router.use(verifyJWT);
router.use('/city-views', cityViewsRouter.privateRouter);
router.use('/users', usersRouter.privateRouter);


module.exports = router;

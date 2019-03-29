const express = require('express');
const usersRouter = require('./users/users.router');
const cityViewsRouter = require('./city-views/city-views.router');
const { isAuthenticated } = require('../middleware/access/isAuthenticated');


const router = express.Router();

router.use(isAuthenticated);
router.use('/city-views', cityViewsRouter.privateRouter);
router.use('/users', usersRouter.privateRouter);


module.exports = router;

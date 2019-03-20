const express = require('express');
const usersRouter = require('./users/users.router');
const cityViewsRouter = require('./city-views/city-views.router');
const { isLoggedIn } = require('../middleware/access/isLoggedIn');


const router = express.Router();

router.use(isLoggedIn);
router.use('/city-views', cityViewsRouter.privateRouter);
router.use('/users', usersRouter.privateRouter);


module.exports = router;

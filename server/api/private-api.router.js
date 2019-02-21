const express = require('express');
const usersRouter = require('./users/users.router');
const cityViewsRouter = require('./city-views/city-views.router');
const { validateJWT } = require('../middleware/access/validate-jwt');


const router = express.Router();

router.use(validateJWT);
router.use('/city-views', cityViewsRouter.privateRouter);
router.use('/users', usersRouter.privateRouter);


module.exports = router;

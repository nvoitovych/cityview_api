const express = require('express');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const cityViewsRouter = require('./city-views/city-views.router');


const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter.publicRouter);
router.use('/city-views', cityViewsRouter.publicRouter);


module.exports = router;

const express = require('express');
const { validateAuthReqBody } = require('./auth.validator');
const { registerUser, loginUser } = require('./auth.controller');

const router = express.Router();


router.post('/register', validateAuthReqBody, registerUser);
router.post('/login', validateAuthReqBody, loginUser);


module.exports = router;

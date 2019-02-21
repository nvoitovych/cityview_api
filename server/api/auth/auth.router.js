const express = require('express');
const { validateAuthReqBody, validateEmailConfirmationToken } = require('./auth.validator');
const { registerUser, loginUser, confirmEmail } = require('./auth.controller');

const router = express.Router();


router.post('/register', validateAuthReqBody, registerUser);
router.post('/login', validateAuthReqBody, loginUser);
router.get('/confirm-email/:token', validateEmailConfirmationToken, confirmEmail);


module.exports = router;

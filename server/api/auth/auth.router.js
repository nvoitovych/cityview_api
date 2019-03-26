const express = require('express');
const passport = require('passport');
const { validateAuthReqBody } = require('./auth.validator');
const { registerUser, loginUser, handleSocialLogin } = require('./auth.controller');


const router = express.Router();

router.post('/register', validateAuthReqBody, registerUser);
router.post('/login', validateAuthReqBody, loginUser);

router.get('/google/start', passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
router.get('/google/redirect', passport.authenticate('google', { session: false }), handleSocialLogin);
router.get('/facebook/start', passport.authenticate('facebook', { session: false, scope: ['public_profile'] }));
router.get('/facebook/redirect', passport.authenticate('facebook', { session: false }), handleSocialLogin);


module.exports = router;

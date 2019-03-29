const express = require('express');
const passport = require('passport');
const {
  validateEmailConfirmationToken,
  validateEmail, validatePassword,
  validatePasswordResetCode,
} = require('./auth.validator');
const {
  registerUser, loginUser, confirmEmail,
  resendEmailConfirmationToken,
  resetForgottenPassword,
  forgotPassword, handleSocialLogin,
} = require('./auth.controller');


const router = express.Router();

router.post('/register', validateEmail, validatePassword, registerUser);
router.get('/confirm-email/', validateEmailConfirmationToken, confirmEmail);
router.post('/login', validateEmail, validatePassword, loginUser);
router.post('/forgot-password/', validateEmail, forgotPassword);
router.post('/reset-password/', validatePasswordResetCode, validateEmail, validatePassword, resetForgottenPassword);
router.post('/resend-email-confirmation-token', validateEmail, resendEmailConfirmationToken);

router.get('/google/start', passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
router.get('/google/redirect', passport.authenticate('google', { session: false }), handleSocialLogin);
router.get('/facebook/start', passport.authenticate('facebook', { session: false, scope: ['public_profile'] }));
router.get('/facebook/redirect', passport.authenticate('facebook', { session: false }), handleSocialLogin);


module.exports = router;

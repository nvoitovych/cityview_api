const express = require('express');
const {
  // validateAuthReqBody,
  validateEmailConfirmationToken,
  validateEmail, validatePassword,
  validatePasswordResetCode,
} = require('./auth.validator');
const {
  registerUser, loginUser, confirmEmail,
  resendEmailConfirmationToken,
  resetForgottenPassword,
  forgotPassword,
} = require('./auth.controller');


const router = express.Router();

// TODO: add google/facebook auth(sign up/in)
router.post('/register', validateEmail, validatePassword, registerUser);
router.get('/confirm-email/', validateEmailConfirmationToken, confirmEmail);
router.post('/login', validateEmail, validatePassword, loginUser);
router.post('/forgot-password/', validateEmail, forgotPassword);
router.post('/reset-password/', validatePasswordResetCode, validateEmail, validatePassword, resetForgottenPassword);
router.post('/resend-email-confirmation-token', validateEmail, resendEmailConfirmationToken);


module.exports = router;

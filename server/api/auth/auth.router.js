const express = require('express');
const {
  validateAuthReqBody, validateEmailConfirmationToken,
  // validateForgotPasswordReqBody, validatePasswordResetConfirmationToken,
  validateLogin,
} = require('./auth.validator');
const {
  registerUser, loginUser, confirmEmail,
  resendEmailConfirmationToken,
  // resetPassword, forgotPassword,
} = require('./auth.controller');


const router = express.Router();

// TODO: add forgot-password(what is the best way?)
// TODO: resend confirmation-email
// TODO: should store email of user
// TODO: who just requested resend confirmation email in redis for some time(1-5 min)?
router.post('/register', validateAuthReqBody, registerUser);
router.get('/confirm-email/', validateEmailConfirmationToken, confirmEmail);
router.post('/login', validateAuthReqBody, loginUser);
// router.post('/forgot-password/', validateForgotPasswordReqBody, forgotPassword);
// router.post('/reset-password/', validatePasswordResetConfirmationToken, resetPassword);
router.post('/resend-email-confirmation-token', validateLogin, resendEmailConfirmationToken);


module.exports = router;

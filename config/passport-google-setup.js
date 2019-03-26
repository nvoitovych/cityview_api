const passport = require('passport');
const passportGoogle = require('passport-google-oauth2');
const { googleAuthStrategy } = require('../server/services/auth.service');


const passportGoogleConfig = {
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET_KEY,
  callbackURL: `${process.env.API_HOST}:${process.env.PORT}/public/auth/google/redirect`,
};

if (passportGoogleConfig.clientID) {
  passport.use(new passportGoogle.OAuth2Strategy(
    passportGoogleConfig,
    googleAuthStrategy,
  ));
}

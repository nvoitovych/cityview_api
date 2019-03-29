const passport = require('passport');
const passportFacebook = require('passport-facebook');
const { facebookAuthStrategyHandler } = require('../server/services/auth.service');


const passportFacebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET_KEY,
  callbackURL: `${process.env.API_HOST}:${process.env.PORT}/public/auth/facebook/redirect`,
  profileFields: ['id', 'displayName', 'name', 'picture.type(large)'],
};

if (passportFacebookConfig.clientID) {
  passport.use(new passportFacebook.Strategy(passportFacebookConfig, facebookAuthStrategyHandler));
}

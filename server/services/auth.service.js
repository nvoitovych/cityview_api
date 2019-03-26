const { user } = require('./users.service');


// TODO: replace done() with next()?
// TODO: handle done(error)?
// eslint-disable-next-line consistent-return
const googleAuthStrategy = async (request, accessToken, refreshToken, profile, done) => {
  const userResult = await user.findOne({ provider: 'google', uid: profile.id }).catch((error) => {
    console.error('userResult | error: ', error);
  });
  if (!userResult) { // user does not exist
    const newUser = await user.create({
      name: profile.displayName,
      provider: 'google',
      uid: profile.id,
      photoUrl: profile.photos[0],
    }).catch((error) => {
      console.error('userResult | error: ', error);
      return done(error);
    });
    if (typeof newUser !== 'undefined') done(null, newUser);
  } else { // user already exists
    return done(null, user);
  }
};

// eslint-disable-next-line consistent-return
const facebookAuthStrategy = async (accessToken, refreshToken, profile, done) => {
  const userResult = await user.findOne({ provider: 'facebook', uid: profile.id }).catch((error) => {
    console.error('userResult | error: ', error);
  });
  if (!userResult) { // user does not exist
    const newUser = await user.create({
      name: profile.displayName,
      provider: 'facebook',
      uid: profile.id,
      photoUrl: profile.photos[0],
    }).catch((error) => {
      console.error('userResult | error: ', error);
      return done(error);
    });
    if (typeof newUser !== 'undefined') done(null, newUser);
  } else { // user already exists
    return done(null, user);
  }
};


module.exports = {
  googleAuthStrategy,
  facebookAuthStrategy,
};

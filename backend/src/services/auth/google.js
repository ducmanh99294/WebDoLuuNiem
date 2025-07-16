const passport = require('passport');
const User = require('../../models/User'); // Adjust the path as necessary
const logger = require('../../utils/logger');
const generateToken = require('../../utils/generateToken'); // Assuming you have a function to generate JWT tokens
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {

    logger.info("Google profile:", profile);
    try {
      const email = profile.emails[0].value;
      const avatar = profile.photos[0].value;
      let user = await User.findOne({ email });

      if (!user) {
        
        const fakePassword = crypto.randomBytes(32).toString('hex');

        user = new User({
          name: profile.displayName,
          email: email,
          image: avatar,
          password: fakePassword,
        })

        await user.save();
        logger.info("New user created:", user);
      }

      const { refreshToken, accessToken } = await generateToken(user); // Assuming you have a function to generate JWT tokens
      return done(null, { user, accessToken, refreshToken });

    } catch (error) {
      logger.error("Error in Google authentication:", error);
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
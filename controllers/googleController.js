const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const User = require("../model/User");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const { emails, displayName, photos } = profile;
      try {
        let user = await User.findOne({ email: emails[0].value });
        if (user) {
          if (!user.profilePicture) {
            user.profilePicture = photos[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.create({
          username: displayName,
          email: emails[0]?.value,
          profilePicture: photos[0]?.value,
        });
        await user.save();
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;

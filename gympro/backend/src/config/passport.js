const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');
const crypto = require('crypto');

const setupPassport = () => {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (_at, _rt, profile, done) => {
      try {
        const email     = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);
        const googleId  = profile.id;
        const name      = profile.displayName || '';
        const avatarUrl = profile.photos?.[0]?.value || '';

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (user) {
          if (!user.googleId) {
            user.googleId = googleId; user.authProvider = 'google';
            user.isEmailVerified = true;
            if (avatarUrl) user.avatar = { url: avatarUrl, publicId: '' };
            await user.save({ validateBeforeSave: false });
          }
          return done(null, user);
        }
        user = await User.create({
          name, email, googleId, authProvider: 'google',
          isEmailVerified: true, role: 'member',
          avatar: { url: avatarUrl, publicId: '' },
          password: crypto.randomBytes(32).toString('hex'),
        });
        return done(null, user);
      } catch (e) { return done(e, null); }
    }
  ));
  passport.serializeUser((u, done) => done(null, u._id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await User.findById(id)); } catch (e) { done(e, null); }
  });
};

module.exports = { setupPassport };

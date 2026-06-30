const User = require('../models/User');
const { generateTokenPair } = require('../utils/jwt');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect(`${CLIENT_URL}/login?error=google_failed`);

    const { accessToken, refreshToken } = generateTokenPair(user);
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
      lastLogin: new Date(),
    });
    res.cookie('refreshToken', refreshToken, COOKIE);
    return res.redirect(`${CLIENT_URL}/auth/google/success?token=${accessToken}`);
  } catch (e) {
    console.error('Google callback error:', e.message);
    return res.redirect(`${CLIENT_URL}/login?error=server_error`);
  }
};

exports.googleFailed = (req, res) => {
  res.redirect(`${CLIENT_URL}/login?error=access_denied`);
};

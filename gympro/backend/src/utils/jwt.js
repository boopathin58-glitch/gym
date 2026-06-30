const jwt = require('jsonwebtoken');
const S  = () => process.env.JWT_SECRET         || 'gympro_access_secret_32chars_dev!';
const RS = () => process.env.JWT_REFRESH_SECRET  || 'gympro_refresh_secret_32chars_dev';

const generateTokenPair = (user) => ({
  accessToken:  jwt.sign({ id: user._id, role: user.role }, S(),  { expiresIn: process.env.JWT_EXPIRES_IN  || '15m' }),
  refreshToken: jwt.sign({ id: user._id, role: user.role }, RS(), { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }),
});

const verifyAccessToken  = (t) => jwt.verify(t, S());
const verifyRefreshToken = (t) => jwt.verify(t, RS());

module.exports = { generateTokenPair, verifyAccessToken, verifyRefreshToken };

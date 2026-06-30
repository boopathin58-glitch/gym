const crypto = require('crypto');
const generateOTP   = (n = 6) => Math.floor(Math.random() * Math.pow(10, n)).toString().padStart(n, '0');
const generateToken = (b = 32) => crypto.randomBytes(b).toString('hex');
const sanitizeUser  = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role,
  avatar: u.avatar, isEmailVerified: u.isEmailVerified,
  profile: u.profile, createdAt: u.createdAt,
});
module.exports = { generateOTP, generateToken, sanitizeUser };

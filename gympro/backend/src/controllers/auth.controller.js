const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

const sendTokenResponse = async (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      provider: user.provider,
      membershipStatus: user.membershipStatus,
      membershipPlan: user.membershipPlan,
      specialty: user.specialty,
      fitnessGoal: user.fitnessGoal,
      isVerified: user.isVerified,
    },
  });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, experience, certifications, fitnessGoal } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    if (!['member', 'trainer'].includes(role)) return res.status(400).json({ success: false, message: 'Role must be member or trainer.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const userData = { name, email, password, role: role || 'member', phone: phone || '', provider: 'email', isVerified: true };
    if (role === 'trainer') {
      userData.specialty = specialty || '';
      userData.experience = experience || 0;
      userData.certifications = certifications ? certifications.split(',').map(c => c.trim()) : [];
    }
    if (role === 'member' && fitnessGoal) userData.fitnessGoal = fitnessGoal;

    const user = await User.create(userData);
    await sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (user.provider === 'google') return res.status(400).json({ success: false, message: 'Please sign in with Google.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (role && user.role !== role) return res.status(403).json({ success: false, message: `This account is registered as '${user.role}', not '${role}'.` });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated.' });

    await sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/google
// Accepts EITHER an id_token (credential) OR an access_token
exports.googleAuth = async (req, res) => {
  try {
    const { credential, access_token, role } = req.body;

    let googleUser = null;

    // ── Case 1: ID token (from Google One Tap / credential flow) ──────────
    if (credential) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const p = ticket.getPayload();
        googleUser = { googleId: p.sub, email: p.email, name: p.name, picture: p.picture };
      } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid Google ID token.' });
      }
    }

    // ── Case 2: Access token (from useGoogleLogin implicit/auth-code flow) ─
    else if (access_token) {
      try {
        // Fetch user info from Google's userinfo endpoint using the access token
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );
        if (!response.ok) throw new Error('Failed to fetch Google user info');
        const p = await response.json();
        if (!p.email) throw new Error('No email returned from Google');
        googleUser = { googleId: p.sub, email: p.email, name: p.name, picture: p.picture };
      } catch (e) {
        return res.status(401).json({ success: false, message: 'Invalid Google access token: ' + e.message });
      }
    }

    else {
      return res.status(400).json({ success: false, message: 'Google credential or access_token required.' });
    }

    // ── Find or create user ───────────────────────────────────────────────
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        avatar: googleUser.picture || '',
        provider: 'google',
        isVerified: true,
        role: role || 'member',
        membershipStatus: 'trial',
      });
    } else {
      // Existing user — check role mismatch
      if (role && user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `This Google account is already registered as '${user.role}'. Please select '${user.role}' role.`,
        });
      }
      if (!user.googleId) user.googleId = googleUser.googleId;
      if (googleUser.picture && !user.avatar) user.avatar = googleUser.picture;
      user.provider = 'google';
      await user.save({ validateBeforeSave: false });
    }

    await sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Google authentication failed: ' + err.message });
  }
};

// @POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required.' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token mismatch. Please log in again.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60000);
    await user.save({ validateBeforeSave: false });
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    res.json({ success: true, message: 'Password reset OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    if (user.resetPasswordOTPExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired.' });
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const express = require('express');
const router = express.Router();
const { register, login, googleAuth, refreshToken, getMe, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;

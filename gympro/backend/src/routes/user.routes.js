const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getProfile, updateProfile, getNotifications, markNotificationRead, getTrainers, getTrainerClients, getMemberDashboard, getTrainerDashboard } = require('../controllers/user.controller');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/trainers', getTrainers);
router.get('/dashboard/member', getMemberDashboard);
router.get('/dashboard/trainer', authorize('trainer', 'admin'), getTrainerDashboard);
router.get('/trainer/clients', authorize('trainer', 'admin'), getTrainerClients);

module.exports = router;

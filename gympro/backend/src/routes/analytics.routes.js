const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getWorkoutAnalytics, getClassAnalytics } = require('../controllers/analytics.controller');

router.use(protect);
router.get('/workouts', getWorkoutAnalytics);
router.get('/classes', getClassAnalytics);

module.exports = router;

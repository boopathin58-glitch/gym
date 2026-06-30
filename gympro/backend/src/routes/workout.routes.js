const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getWeeklyPlan, createPlan, getMyPlans } = require('../controllers/workout.controller');

router.use(protect);
router.get('/weekly-plan', getWeeklyPlan);
router.get('/my-plans', getMyPlans);
router.post('/create', createPlan);

module.exports = router;

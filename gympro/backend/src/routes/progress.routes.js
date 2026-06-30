const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getSummary, logProgress, getHistory } = require('../controllers/progress.controller');

router.use(protect);
router.get('/summary', getSummary);
router.get('/history', getHistory);
router.post('/log', logProgress);

module.exports = router;

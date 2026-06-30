const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMyMembership, subscribe, cancelMembership } = require('../controllers/membership.controller');

router.use(protect);
router.get('/my', getMyMembership);
router.post('/subscribe', subscribe);
router.delete('/cancel', cancelMembership);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getAllClasses, createClass, bookClass, cancelBooking, getMyClasses } = require('../controllers/class.controller');

router.get('/', getAllClasses);
router.use(protect);
router.post('/', createClass);
router.get('/my', getMyClasses);
router.post('/:id/book', bookClass);
router.delete('/:id/cancel', cancelBooking);

module.exports = router;

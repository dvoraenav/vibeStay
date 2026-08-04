const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/check-availability', bookingController.checkAvailability);
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/my-bookings', authenticateToken, bookingController.getMyBookings);

module.exports = router;

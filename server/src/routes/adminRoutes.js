const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All routes here require Admin privileges
router.use(authenticateToken, isAdmin);

router.get('/bookings', authenticateToken, isAdmin, adminController.getAllBookings);
router.put('/bookings/:id/status', authenticateToken, isAdmin, adminController.updateBookingStatus);
router.post('/cabins', authenticateToken, isAdmin, upload.array('images', 5), adminController.addCabin);
router.put('/cabins/:id/price', authenticateToken, isAdmin, adminController.updateCabinPrice);
router.get('/stats', authenticateToken, isAdmin, adminController.getStats);
router.get('/reviews', authenticateToken, isAdmin, adminController.getAllReviews);
router.delete('/reviews/:id', authenticateToken, isAdmin, adminController.deleteReview);
router.post('/reviews/:id/reply', authenticateToken, isAdmin, adminController.addReviewReply);

router.get('/messages', authenticateToken, isAdmin, adminController.getAllMessages);
router.put('/messages/:id/status', authenticateToken, isAdmin, adminController.updateMessageStatus);
router.delete('/messages/:id', authenticateToken, isAdmin, adminController.deleteMessage);

module.exports = router;

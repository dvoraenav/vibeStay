const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, reviewController.addReview);
router.get('/cabin/:cabinId', reviewController.getCabinReviews);

module.exports = router;

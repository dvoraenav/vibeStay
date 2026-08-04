const express = require('express');
const router = express.Router();
const cabinController = require('../controllers/cabinController');
const reviewController = require('../controllers/reviewController');

router.get('/', cabinController.getAllCabins);
router.get('/:id', cabinController.getCabinById);
router.get('/:cabinId/reviews', reviewController.getCabinReviews);

module.exports = router;

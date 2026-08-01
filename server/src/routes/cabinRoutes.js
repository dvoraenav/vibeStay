const express = require('express');
const router = express.Router();
const cabinController = require('../controllers/cabinController');

// נתיב שליפת כל הצימרים (מה ש-Home.jsx קורא לו)
router.get('/', cabinController.getAllCabins);

// נתיב שליפת צימר בודד לפי ID
router.get('/:id', cabinController.getCabinById);

module.exports = router;

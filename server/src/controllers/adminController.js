const cabinService = require('../services/cabinService');
const bookingService = require('../services/bookingService');
const reviewService = require('../services/reviewService');
const fs = require('fs');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.addCabin = async (req, res) => {
  try {
    const { name, location, price_per_night, description } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newCabin = await cabinService.createCabin({ name, location, price_per_night, description, images });
    res.status(201).json({ message: 'הצימר נוסף בהצלחה', cabin: newCabin });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.updateCabinPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_night } = req.body;
    
    if (!price_per_night) {
      return res.status(400).json({ message: 'נא לציין מחיר חדש' });
    }

    const cabin = await cabinService.getCabinById(id);
    await cabinService.updateCabin(id, { ...cabin, price_per_night });
    
    res.json({ message: 'מחיר הצימר עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await bookingService.updateStatus(id, status);
    res.json({ message: 'סטטוס ההזמנה עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await bookingService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id);
    res.json({ message: 'הביקורת נמחקה בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.addReviewReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    await reviewService.addAdminReply(id, reply);
    res.json({ message: 'התגובה נוספה בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

const ContactMessage = require('../models/ContactMessage');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await ContactMessage.updateStatus(id, status);
    res.json({ message: 'סטטוס ההודעה עודכן' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.deleteById(id);
    res.json({ message: 'ההודעה נמחקה בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
  try {
    const { cabin_id, check_in, check_out, total_price } = req.body;
    const user_id = req.user.userId;

    if (!cabin_id || !check_in || !check_out || !total_price) {
      return res.status(400).json({ message: 'נא למלא את כל פרטי ההזמנה' });
    }

    const bookingId = await bookingService.createBooking({
      cabin_id,
      user_id,
      check_in,
      check_out,
      total_price
    });

    res.status(201).json({ message: 'ההזמנה בוצעה בהצלחה', bookingId });
  } catch (error) {
    if (error.message === 'הצימר תפוס בתאריכים שנבחרו' || error.message === 'תאריך עזיבה חייב להיות אחרי תאריך הגעה') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { cabin_id, check_in, check_out } = req.body;
    if (!cabin_id || !check_in || !check_out) {
      return res.status(400).json({ message: 'נא לספק תאריכים לבדיקה' });
    }
    
    if (new Date(check_in) >= new Date(check_out)) {
      return res.json({ available: false, message: 'תאריך עזיבה חייב להיות אחרי תאריך הגעה' });
    }

    const isAvailable = await bookingService.checkAvailability(cabin_id, check_in, check_out);
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const bookings = await bookingService.getUserBookings(user_id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

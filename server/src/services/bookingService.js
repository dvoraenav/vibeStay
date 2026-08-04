const Booking = require('../models/Booking');

class BookingService {
  static async createBooking(data) {
    const { cabin_id, check_in, check_out } = data;
    
    // Check if end date is after start date
    if (new Date(check_in) >= new Date(check_out)) {
      throw new Error('תאריך עזיבה חייב להיות אחרי תאריך הגעה');
    }

    const isAvailable = await Booking.checkAvailability(cabin_id, check_in, check_out);
    if (!isAvailable) {
      throw new Error('הצימר תפוס בתאריכים שנבחרו');
    }

    return Booking.create(data);
  }

  static async checkAvailability(cabin_id, check_in, check_out) {
    return Booking.checkAvailability(cabin_id, check_in, check_out);
  }

  static async getUserBookings(userId) {
    return Booking.findByUserId(userId);
  }

  static async getAllBookings() {
    return Booking.findAll();
  }

  static async updateStatus(id, status) {
    return Booking.updateStatus(id, status);
  }

  static async getDashboardStats() {
    return Booking.getDashboardStats();
  }
}

module.exports = BookingService;

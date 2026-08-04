const db = require('../config/db');

class Booking {
  static async create({ cabin_id, user_id, check_in, check_out, total_price }) {
    const [result] = await db.query(
      'INSERT INTO bookings (cabin_id, user_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [cabin_id, user_id, check_in, check_out, total_price, 'confirmed']
    );
    return result.insertId;
  }

  static async findByUserId(user_id) {
    const [bookings] = await db.query(`
      SELECT b.*, c.name as cabin_name, c.location 
      FROM bookings b 
      JOIN cabins c ON b.cabin_id = c.id 
      WHERE b.user_id = ? 
      ORDER BY b.created_at DESC
    `, [user_id]);
    return bookings;
  }

  static async findAll() {
    const [bookings] = await db.query(`
      SELECT b.*, c.name as cabin_name, u.full_name as user_name 
      FROM bookings b 
      JOIN cabins c ON b.cabin_id = c.id 
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    return bookings;
  }

  static async checkAvailability(cabin_id, check_in, check_out) {
    const [overlapping] = await db.query(`
      SELECT id FROM bookings 
      WHERE cabin_id = ? 
      AND status = 'confirmed'
      AND (
        (check_in <= ? AND check_out >= ?) OR
        (check_in <= ? AND check_out >= ?) OR
        (check_in >= ? AND check_out <= ?)
      )
    `, [cabin_id, check_out, check_in, check_out, check_in, check_in, check_out]);
    
    return overlapping.length === 0;
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  }

  static async getDashboardStats() {
    const [totalBookings] = await db.query('SELECT COUNT(*) as count FROM bookings');
    const [totalRevenue] = await db.query('SELECT SUM(total_price) as sum FROM bookings WHERE status = "confirmed"');
    const [cabinsCount] = await db.query('SELECT COUNT(*) as count FROM cabins');
    
    return {
      totalBookings: totalBookings[0].count || 0,
      totalRevenue: totalRevenue[0].sum || 0,
      totalCabins: cabinsCount[0].count || 0
    };
  }
}

module.exports = Booking;

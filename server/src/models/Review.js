const db = require('../config/db');

class Review {
  static async create({ cabin_id, user_id, rating, comment }) {
    const [result] = await db.query(
      'INSERT INTO reviews (cabin_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [cabin_id, user_id, rating, comment]
    );
    return result.insertId;
  }

  static async findByCabinId(cabin_id) {
    const [reviews] = await db.query(`
      SELECT r.*, u.full_name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.cabin_id = ? 
      ORDER BY r.created_at DESC
    `, [cabin_id]);
    return reviews;
  }

  static async findAll() {
    const [reviews] = await db.query(`
      SELECT r.*, u.full_name as user_name, c.name as cabin_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN cabins c ON r.cabin_id = c.id
      ORDER BY r.created_at DESC
    `);
    return reviews;
  }

  static async deleteById(id) {
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
  }

  static async updateAdminReply(id, reply) {
    await db.query('UPDATE reviews SET admin_reply = ? WHERE id = ?', [reply, id]);
  }
}

module.exports = Review;

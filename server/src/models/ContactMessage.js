const db = require('../config/db');

class ContactMessage {
  static async create({ name, email, phone, message }) {
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );
    return result.insertId;
  }

  static async findAll() {
    const [messages] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return messages;
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
  }

  static async deleteById(id) {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  }
}

module.exports = ContactMessage;

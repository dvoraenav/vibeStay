const db = require('./config/db');

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(50),
          message TEXT NOT NULL,
          status ENUM('unread', 'read') DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table contact_messages created.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();

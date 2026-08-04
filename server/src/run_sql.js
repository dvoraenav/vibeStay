const db = require('./config/db');

async function run() {
  try {
    await db.query('ALTER TABLE reviews ADD COLUMN admin_reply TEXT;');
    console.log('Column admin_reply added.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column admin_reply already exists.');
    } else {
      console.error(err);
    }
  } finally {
    process.exit(0);
  }
}

run();

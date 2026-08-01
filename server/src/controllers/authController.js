const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// הרשמה
exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'נא למלא את כל השדות' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // בדיקה אם אימייל כבר קיים
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'כתובת האימייל כבר קיימת במערכת' });
    }

    const userId = uuidv4(); // UUID לא אינקרמנטלי לאבטחה
    const defaultRoleId = 1; // 1 = customer

    // 1. שמירה בטבלת משתמשים
    await connection.query(
      'INSERT INTO users (id, email, full_name, role_id) VALUES (?, ?, ?, ?)',
      [userId, email, fullName, defaultRoleId]
    );

    // 2. הצפנת סיסמה ושמירה בטבלת סיסמאות נפרדת
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await connection.query(
      'INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)',
      [userId, passwordHash]
    );

    await connection.commit();

    // החזרת תשובה נקייה מסיסמאות!
    res.status(201).json({
      message: 'המשתמש נרשם בהצלחה',
      user: { id: userId, email, fullName, roleId: defaultRoleId }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  } finally {
    connection.release();
  }
};

// התחברות
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'נא להזין אימייל וסיסמה' });
  }

  try {
    // JOIN בין טבלת המשתמשים לטבלת הסיסמאות
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.full_name, u.role_id, u.is_blocked, p.password_hash 
       FROM users u 
       JOIN user_passwords p ON u.id = p.user_id 
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    }

    const user = rows[0];

    if (user.is_blocked) {
      return res.status(403).json({ message: 'משתמש זה חסום על ידי המנהל' });
    }

    // בדיקת סיסמה אך ורק בשרת!
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    }

    // הנפקת JWT עם Payload מוצפן ובטוח (userId בלבד!)
    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // החזרת תשובה ללקוח ללא הסיסמה!
    res.json({
      message: 'התחברות בוצעה בהצלחה',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        roleId: user.role_id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};
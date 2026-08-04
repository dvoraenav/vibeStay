const jwt = require('jsonwebtoken');

// אימות ה-Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'אינך מחובר, נדרש Token' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token לא תקין או פג תוקף' });
    }
    req.user = user;
    next();
  });
};

// בדיקת הרשאת אדמין
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'גישה נדחתה: נדרשות הרשאות מנהל' });
  }
};

module.exports = { authenticateToken, isAdmin };
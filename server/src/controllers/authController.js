const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }

    const role = email === 'admin@vibestay.co.il' ? 'admin' : 'user';

    const user = await authService.register({ email, password, fullName, role });
    res.status(201).json({
      message: 'המשתמש נרשם בהצלחה',
      user
    });
  } catch (error) {
    if (error.message === 'כתובת האימייל כבר קיימת במערכת') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'נא להזין אימייל וסיסמה' });
    }

    const result = await authService.login({ email, password });
    res.json({
      message: 'התחברות בוצעה בהצלחה',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    if (error.message === 'אימייל או סיסמה שגויים') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};
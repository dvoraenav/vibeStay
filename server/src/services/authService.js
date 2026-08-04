const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  static async register({ email, password, fullName, role }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('כתובת האימייל כבר קיימת במערכת');
    }

    const user = await User.create({ email, password, fullName, role });
    return user;
  }

  static async login({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('אימייל או סיסמה שגויים');
    }

    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('אימייל או סיסמה שגויים');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    };
  }
}

module.exports = AuthService;

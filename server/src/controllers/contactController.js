const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'נא למלא את כל השדות חובה' });
    }

    await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ message: 'ההודעה נשלחה בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

// ייבוא המודל של משתמשים
const User = require('../models/User');
// ייבוא bcrypt להצפנת סיסמאות
const bcrypt = require('bcrypt');
// ייבוא jwt ליצירת טוקנים מאובטחים
const jwt = require('jsonwebtoken');

// פונקציה לרישום משתמש חדש (מנהל או עובד)
const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'שם המשתמש כבר קיים' });
    }

    // יצירת אובייקט חדש של משתמש
    const user = new User({ username, password, role });

    // שמירה במסד הנתונים (הסיסמה תוצפן אוטומטית דרך ה־pre ב־schema)
    await user.save();

    res.status(201).json({ message: '✅ משתמש נרשם בהצלחה', user });
  } catch (err) {
    res.status(500).json({ message: '❌ שגיאה ברישום משתמש', error: err.message });
  }
};

// פונקציה להתחברות משתמש
const loginUser = async (req, res) => {
  try {
    
    const { username, password } = req.body;

    // חיפוש המשתמש לפי שם משתמש
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'שם משתמש או סיסמה שגויים' });
    }

    // השוואת הסיסמה המוזנת עם הסיסמה המוצפנת במסד
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'שם משתמש או סיסמה שגויים' });
    }

    // יצירת טוקן מאובטח עם role ו־id
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '6h' }
    );

    res.json({ message: '✅ התחברות הצליחה', token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: '❌ שגיאה בהתחברות', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

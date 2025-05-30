const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// סכמת משתמש
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // שם משתמש חייב להיות ייחודי
    trim: true,
  },
  password: {
    type: String,
    required: true, // סיסמה חובה
    minlength: 4,    // אורך מינימלי
  },
  role: {
    type: String,
    enum: ['admin', 'employee'], // אפשר לבחור רק מנהל או עובד
    default: 'employee',
  },
}, {
  timestamps: true // שדות createdAt ו־updatedAt ייווצרו אוטומטית
});

// hook להצפנת הסיסמה לפני שמירת משתמש
userSchema.pre('save', async function (next) {
  const user = this;

  // אם הסיסמה לא שונתה – לא מצפינים שוב
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);             // יצירת salt
    user.password = await bcrypt.hash(user.password, salt); // הצפנה בפועל
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);

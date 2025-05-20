const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ודא שתיקיית uploads קיימת
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// הגדרת אחסון
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + sanitized);
  }
});

// סינון סוגי קבצים מותרים (תמונות ו־PDF)
const fileFilter = function (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ סוג קובץ לא נתמך: ' + file.mimetype), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
